import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

export interface AliExpressProduct {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  images: string[];
  description: string;
  category: string;
  variants: ProductVariant[];
  supplierId: string;
  supplierName: string;
  sku: string;
  inventory: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  inventory: number;
  attributes: { [key: string]: string };
}

export const syncProductsFromAliExpress = functions.https.onCall(
  async (data, context) => {
    // Verify admin authentication
    if (!context.auth || !context.auth.token.admin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Admin access required"
      );
    }

    try {
      const { supplierId, apiKey, category } = data;

      // Fetch products from AliExpress API (mock implementation)
      const products = await fetchAliExpressProducts(
        supplierId,
        apiKey,
        category
      );

      const batch = db.batch();
      const syncLog = {
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        supplierId,
        totalProducts: products.length,
        status: "processing",
        errors: [],
      };

      // Create sync log
      const syncLogRef = db.collection("syncLogs").doc();
      batch.set(syncLogRef, syncLog);

      let successCount = 0;
      let errorCount = 0;

      for (const product of products) {
        try {
          const productRef = db.collection("products").doc(product.id);
          const productData = {
            ...product,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            syncedAt: admin.firestore.FieldValue.serverTimestamp(),
            status: "active",
          };

          batch.set(productRef, productData, { merge: true });

          // Update inventory
          const inventoryRef = db.collection("inventory").doc(product.id);
          batch.set(
            inventoryRef,
            {
              productId: product.id,
              supplierId: product.supplierId,
              quantity: product.inventory,
              lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
              lowStockThreshold: 10,
            },
            { merge: true }
          );

          successCount++;
        } catch (error) {
          console.error(`Error syncing product ${product.id}:`, error);
          errorCount++;
        }
      }

      // Update sync log
      batch.update(syncLogRef, {
        status: "completed",
        successCount,
        errorCount,
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      await batch.commit();

      return {
        success: true,
        totalProducts: products.length,
        successCount,
        errorCount,
      };
    } catch (error) {
      console.error("Product sync error:", error);
      throw new functions.https.HttpsError("internal", "Product sync failed");
    }
  }
);

export const syncSingleProduct = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Authentication required"
      );
    }

    try {
      const { productId, supplierId } = data;

      // Fetch single product from AliExpress
      const product = await fetchSingleAliExpressProduct(productId, supplierId);

      if (!product) {
        throw new functions.https.HttpsError("not-found", "Product not found");
      }

      const productRef = db.collection("products").doc(productId);
      await productRef.set(
        {
          ...product,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      // Update inventory
      const inventoryRef = db.collection("inventory").doc(productId);
      await inventoryRef.set(
        {
          productId: product.id,
          supplierId: product.supplierId,
          quantity: product.inventory,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          lowStockThreshold: 10,
        },
        { merge: true }
      );

      return { success: true, product };
    } catch (error) {
      console.error("Single product sync error:", error);
      throw new functions.https.HttpsError("internal", "Product sync failed");
    }
  }
);

// Mock function to simulate AliExpress API call
async function fetchAliExpressProducts(
  supplierId: string,
  apiKey: string,
  category?: string
): Promise<AliExpressProduct[]> {
  // In a real implementation, this would call the actual AliExpress API
  // For now, we'll return mock data
  const mockProducts: AliExpressProduct[] = [
    {
      id: `ali_${Date.now()}_1`,
      title: "Premium Wireless Headphones",
      price: 29.99,
      originalPrice: 59.99,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
      ],
      description: "High-quality wireless headphones with noise cancellation",
      category: category || "Electronics",
      variants: [
        {
          id: "var1",
          name: "Black",
          price: 29.99,
          inventory: 100,
          attributes: { color: "Black" },
        },
        {
          id: "var2",
          name: "White",
          price: 29.99,
          inventory: 75,
          attributes: { color: "White" },
        },
      ],
      supplierId,
      supplierName: "TechSupplier Co.",
      sku: `TECH_${Date.now()}`,
      inventory: 175,
    },
  ];

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return mockProducts;
}

async function fetchSingleAliExpressProduct(
  productId: string,
  supplierId: string
): Promise<AliExpressProduct | null> {
  // Mock implementation
  const products = await fetchAliExpressProducts(supplierId, "mock-api-key");
  return products.find((p) => p.id === productId) || null;
}

export const productSync = {
  syncAllProducts: async () => {
    console.log("Syncing all products from all suppliers...");

    // Get all active suppliers
    const suppliersSnapshot = await db
      .collection("suppliers")
      .where("status", "==", "active")
      .get();

    for (const supplierDoc of suppliersSnapshot.docs) {
      const supplier = supplierDoc.data();
      try {
        await fetchAliExpressProducts(supplierDoc.id, supplier.apiKey);
        console.log(`Synced products for supplier: ${supplier.name}`);
      } catch (error) {
        console.error(
          `Failed to sync products for supplier ${supplier.name}:`,
          error
        );
      }
    }
  },
};
