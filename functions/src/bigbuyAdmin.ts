import * as functions from "firebase-functions";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export interface BigBuyProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  images: string[];
  stock: number;
  active: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  ean?: string;
  sku?: string;
  lastUpdated: admin.firestore.Timestamp;
}

// Sync products from BigBuy API
export const syncBigBuyProducts = functions.https.onCall(
  async (data: any, context: any) => {
    // Verify admin access
    if (!context.auth || !context.auth.token.admin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Admin access required"
      );
    }

    try {
      const { category, limit = 100 } = data;
      const apiKey = functions.config().bigbuy.api_key;

      if (!apiKey) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "BigBuy API key not configured"
        );
      }

      // Fetch products from BigBuy API
      const bigBuyUrl = new URL("https://api.bigbuy.eu/rest/catalog/products");
      if (category) {
        bigBuyUrl.searchParams.append("category", category);
      }
      bigBuyUrl.searchParams.append("limit", limit.toString());

      const response = await fetch(bigBuyUrl.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new functions.https.HttpsError(
          "internal",
          `BigBuy API error: ${response.status}`
        );
      }

      const bigBuyData = await response.json();
      const products = bigBuyData.products || [];

      const batch = db.batch();
      let syncedCount = 0;
      let updatedCount = 0;

      for (const bigBuyProduct of products) {
        try {
          // Transform BigBuy product to our format
          const productData: Partial<BigBuyProduct> = {
            id: `bigbuy-${bigBuyProduct.id}`,
            name: bigBuyProduct.name,
            description: bigBuyProduct.description || "",
            price: parseFloat(bigBuyProduct.retailPrice) || 0,
            originalPrice:
              parseFloat(bigBuyProduct.wholeSalePrice) || undefined,
            category: bigBuyProduct.category?.name || "Uncategorized",
            subcategory: bigBuyProduct.subcategory?.name,
            brand: bigBuyProduct.brand?.name,
            images: bigBuyProduct.images?.map((img: any) => img.url) || [],
            stock: parseInt(bigBuyProduct.stock) || 0,
            active: bigBuyProduct.active === true,
            weight: parseFloat(bigBuyProduct.weight) || undefined,
            dimensions: bigBuyProduct.dimensions
              ? {
                  length: parseFloat(bigBuyProduct.dimensions.length) || 0,
                  width: parseFloat(bigBuyProduct.dimensions.width) || 0,
                  height: parseFloat(bigBuyProduct.dimensions.height) || 0,
                }
              : undefined,
            ean: bigBuyProduct.ean,
            sku: bigBuyProduct.sku,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp() as any,
          };

          // Check if product already exists
          const productRef = db.collection("products").doc(productData.id!);
          const existingProduct = await productRef.get();

          if (existingProduct.exists) {
            // Update existing product
            batch.update(productRef, productData);
            updatedCount++;
          } else {
            // Create new product
            batch.set(productRef, productData);
            syncedCount++;
          }

          // Also update our local product collection for admin management
          const adminProductRef = db
            .collection("admin_products")
            .doc(productData.id!);
          batch.set(
            adminProductRef,
            {
              ...productData,
              origin: "BigBuy",
              syncedAt: admin.firestore.FieldValue.serverTimestamp(),
              // Add SEO fields with defaults
              metaTitle: `${productData.name} - Premium Quality`,
              metaDescription: productData.description?.substring(0, 160) || "",
              slug: productData.name
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, ""),
              imageAlt: productData.name,
              tags: ["premium", "quality"],
              inStock: productData.stock! > 0,
              featured: false,
              sustainable: false,
              vegan: false,
              crueltyFree: false,
            },
            { merge: true }
          );
        } catch (productError) {
          console.error(
            `Error processing product ${bigBuyProduct.id}:`,
            productError
          );
          // Continue with other products
        }
      }

      // Commit the batch
      await batch.commit();

      // Log sync activity
      await db.collection("sync_logs").add({
        type: "bigbuy_products",
        syncedCount,
        updatedCount,
        totalProcessed: products.length,
        category: category || "all",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        performedBy: context.auth.uid,
      });

      return {
        success: true,
        syncedCount,
        updatedCount,
        totalProcessed: products.length,
      };
    } catch (error) {
      console.error("BigBuy sync error:", error);
      throw new functions.https.HttpsError("internal", "Sync failed");
    }
  }
);

// Get BigBuy product stock
export const getBigBuyStock = functions.https.onCall(
  async (data: any, context: any) => {
    try {
      const { productId } = data;
      const apiKey = functions.config().bigbuy.api_key;

      if (!productId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Product ID required"
        );
      }

      if (!apiKey) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "BigBuy API key not configured"
        );
      }

      // Extract BigBuy ID from our product ID
      const bigBuyId = productId.replace("bigbuy-", "");

      const response = await fetch(
        `https://api.bigbuy.eu/rest/catalog/products/${bigBuyId}/stock`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new functions.https.HttpsError(
          "internal",
          `BigBuy API error: ${response.status}`
        );
      }

      const stockData = await response.json();

      // Update our local stock data
      await db
        .collection("products")
        .doc(productId)
        .update({
          stock: stockData.stock || 0,
          lastStockUpdate: admin.firestore.FieldValue.serverTimestamp(),
        });

      return {
        productId,
        stock: stockData.stock || 0,
        available: stockData.stock > 0,
      };
    } catch (error) {
      console.error("BigBuy stock check error:", error);
      throw new functions.https.HttpsError("internal", "Stock check failed");
    }
  }
);

// Batch update stock for multiple products
export const batchUpdateBigBuyStock = functions.https.onCall(
  async (data: any, context: any) => {
    if (!context.auth || !context.auth.token.admin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Admin access required"
      );
    }

    try {
      const { productIds } = data;
      const apiKey = functions.config().bigbuy.api_key;

      if (!productIds || !Array.isArray(productIds)) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Product IDs array required"
        );
      }

      if (!apiKey) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "BigBuy API key not configured"
        );
      }

      const results = [];
      const batch = db.batch();

      for (const productId of productIds.slice(0, 100)) {
        // Limit to 100 products per batch
        try {
          const bigBuyId = productId.replace("bigbuy-", "");

          const response = await fetch(
            `https://api.bigbuy.eu/rest/catalog/products/${bigBuyId}/stock`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const stockData = await response.json();
            const stock = stockData.stock || 0;

            // Update in batch
            const productRef = db.collection("products").doc(productId);
            batch.update(productRef, {
              stock,
              lastStockUpdate: admin.firestore.FieldValue.serverTimestamp(),
            });

            results.push({
              productId,
              stock,
              success: true,
            });
          } else {
            results.push({
              productId,
              success: false,
              error: `API error: ${response.status}`,
            });
          }
        } catch (productError) {
          const errorMessage =
            productError instanceof Error
              ? productError.message
              : "Unknown error";
          results.push({
            productId,
            success: false,
            error: errorMessage,
          });
        }
      }

      // Commit batch updates
      await batch.commit();

      // Log batch update
      await db.collection("sync_logs").add({
        type: "batch_stock_update",
        totalProducts: productIds.length,
        successfulUpdates: results.filter((r) => r.success).length,
        failedUpdates: results.filter((r) => !r.success).length,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        performedBy: context.auth.uid,
      });

      return {
        success: true,
        results,
        totalProcessed: productIds.length,
        successfulUpdates: results.filter((r) => r.success).length,
      };
    } catch (error) {
      console.error("Batch stock update error:", error);
      throw new functions.https.HttpsError("internal", "Batch update failed");
    }
  }
);

// Schedule automatic stock updates (runs every 6 hours)
export const scheduledStockUpdate = onSchedule(
  {
    schedule: "every 6 hours",
    region: "europe-west1",
  },
  async (event) => {
    try {
      // Get all BigBuy products
      const productsSnapshot = await db
        .collection("products")
        .where("id", ">=", "bigbuy-")
        .where("id", "<", "bigbuy-\uf8ff")
        .limit(100) // Process in batches
        .get();

      const productIds = productsSnapshot.docs.map((doc) => doc.id);

      if (productIds.length === 0) {
        console.log("No BigBuy products found for stock update");
        return;
      }

      // Perform stock updates directly
      const apiKey = functions.config().bigbuy.api_key;
      if (!apiKey) {
        console.error("BigBuy API key not configured for scheduled update");
        return;
      }

      const results = [];
      const batch = db.batch();

      for (const productId of productIds) {
        try {
          // Extract BigBuy ID from our product ID format
          const bigbuyId = productId.replace("bigbuy-", "");

          // Get current stock from BigBuy API
          const stockResponse = await fetch(
            `https://api.bigbuy.eu/rest/catalog/productstock/${bigbuyId}.json`,
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (stockResponse.ok) {
            const stockData = await stockResponse.json();
            const productRef = db.collection("products").doc(productId);

            batch.update(productRef, {
              stock: stockData.quantity || 0,
              lastStockUpdate: admin.firestore.FieldValue.serverTimestamp(),
            });

            results.push({
              productId,
              success: true,
              newStock: stockData.quantity || 0,
            });
          } else {
            results.push({
              productId,
              success: false,
              error: `API error: ${stockResponse.status}`,
            });
          }
        } catch (productError) {
          const errorMessage =
            productError instanceof Error
              ? productError.message
              : "Unknown error";
          results.push({
            productId,
            success: false,
            error: errorMessage,
          });
        }
      }

      // Commit batch updates
      await batch.commit();

      const successfulUpdates = results.filter((r) => r.success).length;

      // Log the update
      await db.collection("sync_logs").add({
        type: "scheduled_stock_update",
        totalProducts: productIds.length,
        successfulUpdates,
        failedUpdates: results.filter((r) => !r.success).length,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        performedBy: "system",
      });

      console.log(
        `Scheduled stock update completed: ${successfulUpdates}/${productIds.length} products updated`
      );
    } catch (error) {
      console.error("Scheduled stock update failed:", error);
    }
  }
);
