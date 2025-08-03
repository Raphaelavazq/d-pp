import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

// BigBuy API Configuration
const BIGBUY_API_BASE = "https://api.bigbuy.eu";
const BIGBUY_API_KEY = functions.config().bigbuy?.api_key;

interface BigBuyProduct {
  id: number;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  wholesalePrice?: number;
  stock: number;
  sku: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  images: string[];
  thumbnail?: string;
  attributes?: Record<string, any>;
  variations?: any[];
  weight?: number;
  dimensions?: Record<string, any>;
  warranty?: string;
  minimumOrderQuantity?: number;
}

// Helper function to create BigBuy API headers
const getBigBuyHeaders = () => ({
  Authorization: `Bearer ${BIGBUY_API_KEY}`,
  "Content-Type": "application/json",
});

// Helper to validate admin access (same as other Cloud Functions)
const validateAdminAccess = async (
  context: functions.https.CallableContext
) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required"
    );
  }

  const uid = context.auth.uid;
  const userRecord = await admin.auth().getUser(uid);
  const customClaims = userRecord.customClaims;

  if (!customClaims?.admin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Admin access required"
    );
  }
};

// Search BigBuy products
export const searchBigBuyProducts = functions.https.onCall(
  async (data, context) => {
    await validateAdminAccess(context);

    if (!BIGBUY_API_KEY) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "BigBuy API key not configured"
      );
    }

    const { query = "", category = "", limit = 50, offset = 0 } = data;

    // Build search parameters
    const searchParams: Record<string, any> = {
      limit: Math.min(limit, 100), // Max 100 per request
      offset,
    };

    if (query) {
      searchParams.search = query;
    }

    if (category) {
      searchParams.category = category;
    }

    // Make request to BigBuy API
    const response = await axios.get(
      `${BIGBUY_API_BASE}/rest/catalog/products`,
      {
        headers: getBigBuyHeaders(),
        params: searchParams,
        timeout: 30000, // 30 second timeout
      }
    );

    if (response.status !== 200) {
      throw new functions.https.HttpsError(
        "internal",
        `BigBuy API returned status ${response.status}`
      );
    }

    const products = response.data?.data || [];

    // Transform products to our format
    const transformedProducts: BigBuyProduct[] = products.map(
      (product: any) => ({
        id: product.id,
        name: product.name || "",
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        price: parseFloat(product.retailPrice || product.price || 0),
        originalPrice: parseFloat(product.originalPrice || 0),
        wholesalePrice: parseFloat(
          product.wholesalePrice || product.price || 0
        ),
        stock: parseInt(product.stock || 0),
        sku: product.sku || product.id?.toString() || "",
        category: product.category?.name || "",
        subcategory: product.subcategory?.name || "",
        brand: product.brand?.name || "",
        images: product.images?.map((img: any) => img.url || img) || [],
        thumbnail: product.images?.[0]?.url || product.images?.[0] || "",
        attributes: product.attributes || {},
        variations: product.variations || [],
        weight: parseFloat(product.weight || 0),
        dimensions: product.dimensions || {},
        warranty: product.warranty || "",
        minimumOrderQuantity: parseInt(product.minimumOrderQuantity || 1),
      })
    );

    functions.logger.info(
      `BigBuy search completed: ${transformedProducts.length} products found`,
      {
        query,
        category,
        resultCount: transformedProducts.length,
      }
    );

    return {
      success: true,
      products: transformedProducts,
      total: response.data?.total || transformedProducts.length,
      hasMore:
        offset + transformedProducts.length < (response.data?.total || 0),
    };
  }
);

// Get detailed product information from BigBuy
export const getBigBuyProductDetails = functions.https.onCall(
  async (data, context) => {
    await validateAdminAccess(context);

    if (!BIGBUY_API_KEY) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "BigBuy API key not configured"
      );
    }

    const { productId } = data;
    if (!productId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Product ID is required"
      );
    }

    // Get detailed product info from BigBuy
    const response = await axios.get(
      `${BIGBUY_API_BASE}/rest/catalog/products/${productId}`,
      {
        headers: getBigBuyHeaders(),
        timeout: 30000,
      }
    );

    if (response.status !== 200) {
      throw new functions.https.HttpsError(
        "internal",
        `BigBuy API returned status ${response.status}`
      );
    }

    const product = response.data;

    // Transform product data
    const transformedProduct: BigBuyProduct = {
      id: product.id,
      name: product.name || "",
      description: product.description || "",
      shortDescription: product.shortDescription || "",
      price: parseFloat(product.retailPrice || product.price || 0),
      originalPrice: parseFloat(product.originalPrice || 0),
      wholesalePrice: parseFloat(product.wholesalePrice || product.price || 0),
      stock: parseInt(product.stock || 0),
      sku: product.sku || product.id?.toString() || "",
      category: product.category?.name || "",
      subcategory: product.subcategory?.name || "",
      brand: product.brand?.name || "",
      images: product.images?.map((img: any) => img.url || img) || [],
      thumbnail: product.images?.[0]?.url || product.images?.[0] || "",
      attributes: product.attributes || {},
      variations: product.variations || [],
      weight: parseFloat(product.weight || 0),
      dimensions: product.dimensions || {},
      warranty: product.warranty || "",
      minimumOrderQuantity: parseInt(product.minimumOrderQuantity || 1),
    };

    functions.logger.info(`BigBuy product details retrieved: ${productId}`, {
      productId,
      productName: transformedProduct.name,
    });

    return {
      success: true,
      product: transformedProduct,
    };
  }
);

// Get BigBuy categories
export const getBigBuyCategories = functions.https.onCall(
  async (data, context) => {
    await validateAdminAccess(context);

    if (!BIGBUY_API_KEY) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "BigBuy API key not configured"
      );
    }

    // Get categories from BigBuy
    const response = await axios.get(
      `${BIGBUY_API_BASE}/rest/catalog/categories`,
      {
        headers: getBigBuyHeaders(),
        timeout: 30000,
      }
    );

    if (response.status !== 200) {
      throw new functions.https.HttpsError(
        "internal",
        `BigBuy API returned status ${response.status}`
      );
    }

    const categories = response.data?.data || [];

    functions.logger.info(
      `BigBuy categories retrieved: ${categories.length} categories`
    );

    return {
      success: true,
      categories: categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        parentId: cat.parentId || null,
        hasChildren: cat.hasChildren || false,
      })),
    };
  }
);

// Sync stock levels for imported BigBuy products
export const syncBigBuyStock = functions.https.onCall(async (data, context) => {
  await validateAdminAccess(context);

  if (!BIGBUY_API_KEY) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "BigBuy API key not configured"
    );
  }

  const db = admin.firestore();
  const { productIds } = data;

  // Get BigBuy products from Firestore
  let query = db.collection("products").where("origin", "==", "BigBuy");

  if (productIds && productIds.length > 0) {
    query = query.where("bigBuyId", "in", productIds);
  }

  const snapshot = await query.get();
  const updates: Promise<any>[] = [];

  for (const doc of snapshot.docs) {
    const productData = doc.data();
    const bigBuyId = productData.bigBuyId;

    if (!bigBuyId) continue;

    try {
      // Get current stock from BigBuy
      const stockResponse = await axios.get(
        `${BIGBUY_API_BASE}/rest/catalog/products/${bigBuyId}/stock`,
        {
          headers: getBigBuyHeaders(),
          timeout: 15000,
        }
      );

      if (stockResponse.status === 200) {
        const currentStock = parseInt(stockResponse.data?.quantity || 0);

        // Update Firestore if stock has changed
        if (currentStock !== productData.stock) {
          updates.push(
            doc.ref.update({
              stock: currentStock,
              inStock: currentStock > 0,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              lastStockSync: admin.firestore.FieldValue.serverTimestamp(),
            })
          );
        }
      }
    } catch (stockError) {
      functions.logger.warn(
        `Failed to sync stock for product ${bigBuyId}:`,
        stockError
      );
    }
  }

  await Promise.all(updates);

  functions.logger.info(
    `BigBuy stock sync completed: ${updates.length} products updated`
  );

  return {
    success: true,
    updatedCount: updates.length,
    totalProcessed: snapshot.docs.length,
  };
});

// Scheduled stock sync (runs every hour)
export const scheduledBigBuyStockSync = functions.pubsub
  .schedule("0 * * * *") // Every hour
  .timeZone("UTC")
  .onRun(async (context) => {
    functions.logger.info("Running scheduled BigBuy stock sync...");

    try {
      if (!BIGBUY_API_KEY) {
        functions.logger.warn(
          "BigBuy API key not configured, skipping stock sync"
        );
        return;
      }

      const db = admin.firestore();

      // Get all BigBuy products
      const snapshot = await db
        .collection("products")
        .where("origin", "==", "BigBuy")
        .where("status", "==", "active")
        .get();

      let updatedCount = 0;

      // Process in batches to avoid rate limits
      const batchSize = 10;
      for (let i = 0; i < snapshot.docs.length; i += batchSize) {
        const batch = snapshot.docs.slice(i, i + batchSize);

        await Promise.all(
          batch.map(async (doc) => {
            const productData = doc.data();
            const bigBuyId = productData.bigBuyId;

            if (!bigBuyId) return;

            try {
              const stockResponse = await axios.get(
                `${BIGBUY_API_BASE}/rest/catalog/products/${bigBuyId}/stock`,
                {
                  headers: getBigBuyHeaders(),
                  timeout: 15000,
                }
              );

              if (stockResponse.status === 200) {
                const currentStock = parseInt(
                  stockResponse.data?.quantity || 0
                );

                if (currentStock !== productData.stock) {
                  await doc.ref.update({
                    stock: currentStock,
                    inStock: currentStock > 0,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    lastStockSync: admin.firestore.FieldValue.serverTimestamp(),
                  });
                  updatedCount++;
                }
              }
            } catch (error) {
              functions.logger.warn(
                `Failed to sync stock for product ${bigBuyId}:`,
                error
              );
            }
          })
        );

        // Add delay between batches to respect rate limits
        if (i + batchSize < snapshot.docs.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      functions.logger.info(
        `Scheduled BigBuy stock sync completed: ${updatedCount} products updated`
      );
    } catch (error) {
      functions.logger.error("Scheduled BigBuy stock sync error:", error);
    }
  });
