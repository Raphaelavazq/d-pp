import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { validateAdminAccess, logAdminAction } from "./utils/adminValidation";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export interface InventoryItem {
  productId: string;
  supplierId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  reorderPoint: number;
  lastUpdated: admin.firestore.Timestamp;
  status: "in_stock" | "low_stock" | "out_of_stock" | "discontinued";
}

/**
 * Get inventory overview with pagination and filtering
 */
export const getInventoryOverview = onCall(
  { region: "europe-west1" },
  async (request) => {
    await validateAdminAccess(request.auth);

    try {
      const { page = 1, limit = 20, status, lowStock = false } = request.data;

      let query = db.collection("inventory");

      if (status) {
        query = query.where("status", "==", status) as any;
      }

      if (lowStock) {
        query = query.where("quantity", "<=", 10) as any;
      }

      const snapshot = await query
        .orderBy("lastUpdated", "desc")
        .limit(limit)
        .offset((page - 1) * limit)
        .get();

      const items: InventoryItem[] = [];

      for (const doc of snapshot.docs) {
        const data = doc.data() as InventoryItem;
        items.push({
          ...data,
          productId: doc.id,
        });
      }

      await logAdminAction(request.auth?.uid, "getInventoryOverview", {
        page,
        limit,
        status,
        lowStock,
      });

      return {
        success: true,
        data: { items },
      };
    } catch (error) {
      console.error("Error getting inventory overview:", error);
      throw new Error("Failed to get inventory overview");
    }
  }
);

/**
 * Update inventory quantity for a specific product
 */
export const updateInventoryQuantity = onCall(
  { region: "europe-west1" },
  async (request) => {
    await validateAdminAccess(request.auth);

    try {
      const {
        productId,
        quantity,
        reason = "Manual adjustment",
      } = request.data;

      if (!productId || quantity === undefined) {
        throw new Error("Product ID and quantity are required");
      }

      if (quantity < 0) {
        throw new Error("Quantity cannot be negative");
      }

      const inventoryRef = db.collection("inventory").doc(productId);

      await inventoryRef.update({
        quantity,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        status:
          quantity <= 0
            ? "out_of_stock"
            : quantity <= 10
              ? "low_stock"
              : "in_stock",
      });

      await logAdminAction(request.auth?.uid, "updateInventoryQuantity", {
        productId,
        quantity,
        reason,
      });

      return {
        success: true,
        message: "Inventory updated successfully",
      };
    } catch (error) {
      console.error("Error updating inventory quantity:", error);
      throw new Error("Failed to update inventory quantity");
    }
  }
);
