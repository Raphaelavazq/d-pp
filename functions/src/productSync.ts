import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export interface AliExpressProduct {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  soldCount: number;
  imageUrl: string;
  category: string;
  supplier: string;
  inventory: number;
  attributes: { [key: string]: string };
}

export const syncProductsFromAliExpress = onCall(
  { region: "europe-west1" },
  async (request) => {
    // Verify admin authentication
    if (!request.auth) {
      throw new Error("Authentication required");
    }

    // Check if user is admin
    const userDoc = await db.collection("users").doc(request.auth.uid).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== "admin") {
      throw new Error("Admin access required");
    }

    try {
      const { supplierId, apiKey, category } = request.data;

      if (!supplierId || !apiKey) {
        throw new Error("Supplier ID and API key are required");
      }

      // Mock AliExpress API integration (replace with actual API calls)
      const mockProducts: AliExpressProduct[] = [
        {
          id: `aliexpress-${Date.now()}-1`,
          title: "Premium Wireless Headphones",
          price: 89.99,
          originalPrice: 129.99,
          discount: 30,
          rating: 4.5,
          soldCount: 1247,
          imageUrl: "https://example.com/headphones.jpg",
          category: category || "Electronics",
          supplier: supplierId,
          inventory: 50,
          attributes: {
            color: "Black",
            brand: "TechBrand",
            weight: "250g",
          },
        },
        // Add more mock products as needed
      ];

      // Process and save products to Firestore
      const batch = db.batch();
      const results = [];

      for (const product of mockProducts) {
        const productRef = db.collection("products").doc(product.id);

        const productData = {
          ...product,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "active",
          tags: [category, "imported", "aliexpress"],
        };

        batch.set(productRef, productData);
        results.push({
          id: product.id,
          title: product.title,
          success: true,
        });
      }

      await batch.commit();

      return {
        success: true,
        message: `Successfully synced ${results.length} products from AliExpress`,
        products: results,
      };
    } catch (error) {
      console.error("Error syncing AliExpress products:", error);
      throw new Error("Failed to sync products from AliExpress");
    }
  }
);

export const removeProductFromSync = onCall(
  { region: "europe-west1" },
  async (request) => {
    if (!request.auth) {
      throw new Error("Authentication required");
    }

    // Check if user is admin
    const userDoc = await db.collection("users").doc(request.auth.uid).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== "admin") {
      throw new Error("Admin access required");
    }

    try {
      const { productId } = request.data;

      if (!productId) {
        throw new Error("Product ID is required");
      }

      // Remove product from Firestore
      await db.collection("products").doc(productId).delete();

      return {
        success: true,
        message: `Product ${productId} removed successfully`,
      };
    } catch (error) {
      console.error("Error removing product:", error);
      throw new Error("Failed to remove product");
    }
  }
);

export const updateProductPricing = onCall(
  { region: "europe-west1" },
  async (request) => {
    if (!request.auth) {
      throw new Error("Authentication required");
    }

    // Check if user is admin
    const userDoc = await db.collection("users").doc(request.auth.uid).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== "admin") {
      throw new Error("Admin access required");
    }

    try {
      const { productId, newPrice, markup } = request.data;

      if (!productId || !newPrice) {
        throw new Error("Product ID and new price are required");
      }

      const productRef = db.collection("products").doc(productId);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        throw new Error("Product not found");
      }

      const updateData: any = {
        price: newPrice,
        updatedAt: new Date(),
      };

      if (markup) {
        updateData.markup = markup;
      }

      await productRef.update(updateData);

      return {
        success: true,
        message: `Product pricing updated successfully`,
      };
    } catch (error) {
      console.error("Error updating product pricing:", error);
      throw new Error("Failed to update product pricing");
    }
  }
);

export const syncProductInventory = onCall(
  { region: "europe-west1" },
  async (request) => {
    if (!request.auth) {
      throw new Error("Authentication required");
    }

    // Check if user is admin
    const userDoc = await db.collection("users").doc(request.auth.uid).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== "admin") {
      throw new Error("Admin access required");
    }

    try {
      const { productIds } = request.data;

      if (!productIds || !Array.isArray(productIds)) {
        throw new Error("Product IDs array is required");
      }

      const batch = db.batch();
      const results = [];

      for (const productId of productIds) {
        try {
          // Mock inventory sync (replace with actual supplier API calls)
          const mockInventory = Math.floor(Math.random() * 100) + 10;

          const productRef = db.collection("products").doc(productId);
          batch.update(productRef, {
            inventory: mockInventory,
            lastInventorySync: new Date(),
          });

          results.push({
            productId,
            inventory: mockInventory,
            success: true,
          });
        } catch (error) {
          results.push({
            productId,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      await batch.commit();

      const successCount = results.filter((r) => r.success).length;

      return {
        success: true,
        message: `Inventory synced for ${successCount}/${results.length} products`,
        results,
      };
    } catch (error) {
      console.error("Error syncing product inventory:", error);
      throw new Error("Failed to sync product inventory");
    }
  }
);
