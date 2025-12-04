import { onCall } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import axios from "axios";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// BigBuy API Configuration
const BIGBUY_API_BASE = "https://api.bigbuy.eu";
// Use environment variable for modern Firebase Functions
const BIGBUY_API_KEY = process.env.BIGBUY_API_KEY;

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

// Search BigBuy products
export const searchBigBuyProducts = onCall(
  { region: "europe-west1" },
  async (request) => {
    const { data, auth } = request;

    // Check admin access
    if (!auth) {
      throw new Error("Authentication required");
    }

    if (!BIGBUY_API_KEY) {
      throw new Error("BigBuy API key not configured");
    }

    const { query = "", category = "", limit = 50, offset = 0 } = data;

    // Build search parameters
    const searchParams: Record<string, any> = {
      limit: Math.min(limit, 100), // Max 100 per request
      offset,
    };

    if (query) {
      searchParams.name = query;
    }

    if (category) {
      searchParams.category = category;
    }

    try {
      const response = await axios.get(
        `${BIGBUY_API_BASE}/rest/catalog/products`,
        {
          headers: getBigBuyHeaders(),
          params: searchParams,
          timeout: 30000, // 30 second timeout
        }
      );

      if (response.status !== 200) {
        throw new Error(`BigBuy API returned status ${response.status}`);
      }

      const products = response.data?.data || [];

      // Transform products to our format
      const transformedProducts: BigBuyProduct[] = products.map(
        (product: any) => ({
          id: product.id,
          name: product.name || "",
          description: product.description || "",
          shortDescription: product.shortDescription || "",
          price: parseFloat(product.retailPrice || 0),
          originalPrice: parseFloat(product.retailPrice || 0),
          wholesalePrice: parseFloat(product.wholesalePrice || 0),
          stock: parseInt(product.stock || 0),
          sku: product.sku || "",
          category: product.category?.name || "",
          subcategory: product.subcategory?.name || "",
          brand: product.brand?.name || "",
          images: product.images?.map((img: any) => img.url) || [],
          thumbnail: product.images?.[0]?.url || "",
          attributes: product.attributes || {},
          variations: product.variations || [],
          weight: parseFloat(product.weight || 0),
          dimensions: product.dimensions || {},
          warranty: product.warranty || "",
          minimumOrderQuantity: parseInt(product.minimumOrderQuantity || 1),
        })
      );

      console.log(
        `BigBuy product search completed: ${transformedProducts.length} products found`
      );

      return {
        success: true,
        data: transformedProducts,
        pagination: {
          total: response.data?.pagination?.total || 0,
          offset,
          limit,
        },
      };
    } catch (error: any) {
      console.error("BigBuy search error:", error.message);
      throw new Error(`Failed to search BigBuy products: ${error.message}`);
    }
  }
);

// Get detailed product information from BigBuy
export const getBigBuyProductDetails = onCall(
  { region: "europe-west1" },
  async (request) => {
    const { data, auth } = request;

    // Check admin access
    if (!auth) {
      throw new Error("Authentication required");
    }

    if (!BIGBUY_API_KEY) {
      throw new Error("BigBuy API key not configured");
    }

    const { productId } = data;

    if (!productId) {
      throw new Error("Product ID is required");
    }

    try {
      const response = await axios.get(
        `${BIGBUY_API_BASE}/rest/catalog/products/${productId}`,
        {
          headers: getBigBuyHeaders(),
          timeout: 15000,
        }
      );

      if (response.status !== 200) {
        throw new Error(`BigBuy API returned status ${response.status}`);
      }

      const product = response.data;

      if (!product) {
        throw new Error("Product not found");
      }

      const transformedProduct: BigBuyProduct = {
        id: product.id,
        name: product.name || "",
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        price: parseFloat(product.retailPrice || 0),
        originalPrice: parseFloat(product.retailPrice || 0),
        wholesalePrice: parseFloat(product.wholesalePrice || 0),
        stock: parseInt(product.stock || 0),
        sku: product.sku || "",
        category: product.category?.name || "",
        subcategory: product.subcategory?.name || "",
        brand: product.brand?.name || "",
        images: product.images?.map((img: any) => img.url) || [],
        thumbnail: product.images?.[0]?.url || "",
        attributes: product.attributes || {},
        variations: product.variations || [],
        weight: parseFloat(product.weight || 0),
        dimensions: product.dimensions || {},
        warranty: product.warranty || "",
        minimumOrderQuantity: parseInt(product.minimumOrderQuantity || 1),
      };

      console.log(`BigBuy product details retrieved: ${productId}`, {
        productId,
        name: product.name,
      });

      return {
        success: true,
        data: transformedProduct,
      };
    } catch (error: any) {
      console.error("BigBuy product details error:", error.message);
      throw new Error(`Failed to get product details: ${error.message}`);
    }
  }
);

// Get BigBuy categories
export const getBigBuyCategories = onCall(
  { region: "europe-west1" },
  async (request) => {
    const { auth } = request;

    // Check admin access
    if (!auth) {
      throw new Error("Authentication required");
    }

    if (!BIGBUY_API_KEY) {
      throw new Error("BigBuy API key not configured");
    }

    try {
      const response = await axios.get(
        `${BIGBUY_API_BASE}/rest/catalog/categories`,
        {
          headers: getBigBuyHeaders(),
          timeout: 15000,
        }
      );

      if (response.status !== 200) {
        throw new Error(`BigBuy API returned status ${response.status}`);
      }

      const categories = response.data?.data || [];

      console.log(
        `BigBuy categories retrieved: ${categories.length} categories`
      );

      return {
        success: true,
        data: categories,
      };
    } catch (error: any) {
      console.error("BigBuy categories error:", error.message);
      throw new Error(`Failed to get categories: ${error.message}`);
    }
  }
);

// Sync BigBuy stock for existing products
export const syncBigBuyStock = onCall(
  { region: "europe-west1" },
  async (request) => {
    const { auth } = request;

    // Check admin access
    if (!auth) {
      throw new Error("Authentication required");
    }

    if (!BIGBUY_API_KEY) {
      throw new Error("BigBuy API key not configured");
    }

    try {
      const db = admin.firestore();

      // Get all BigBuy products
      const snapshot = await db
        .collection("products")
        .where("origin", "==", "BigBuy")
        .where("status", "==", "active")
        .get();

      if (snapshot.empty) {
        return {
          success: true,
          message: "No BigBuy products found to sync",
          totalProcessed: 0,
        };
      }

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
            } catch (error: any) {
              console.warn(
                `Failed to sync stock for product ${bigBuyId}:`,
                error.message
              );
            }
          })
        );

        // Add delay between batches to respect rate limits
        if (i + batchSize < snapshot.docs.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      console.log(
        `BigBuy stock sync completed: ${updatedCount} products updated`
      );

      return {
        success: true,
        message: `Stock sync completed: ${updatedCount} products updated`,
        totalProcessed: snapshot.docs.length,
      };
    } catch (error: any) {
      console.error("BigBuy stock sync error:", error.message);
      throw new Error(`Failed to sync stock: ${error.message}`);
    }
  }
);

// Scheduled stock sync (runs every hour)
export const scheduledBigBuyStockSync = onSchedule(
  {
    schedule: "0 * * * *",
    region: "europe-west1",
  },
  async (event) => {
    console.log("Running scheduled BigBuy stock sync...");

    try {
      if (!BIGBUY_API_KEY) {
        console.warn("BigBuy API key not configured, skipping stock sync");
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
            } catch (error: any) {
              console.warn(
                `Failed to sync stock for product ${bigBuyId}:`,
                error.message
              );
            }
          })
        );

        // Add delay between batches to respect rate limits
        if (i + batchSize < snapshot.docs.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      console.log(
        `Scheduled BigBuy stock sync completed: ${updatedCount} products updated`
      );
    } catch (error: any) {
      console.error("Scheduled BigBuy stock sync error:", error.message);
    }
  }
);
