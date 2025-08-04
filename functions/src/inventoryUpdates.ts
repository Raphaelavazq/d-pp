import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

interface InventoryUpdateItem {
  productId: string;
  supplierId: string;
  quantity: number;
  lowStockThreshold: number;
  lastUpdated: admin.firestore.Timestamp;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

// Real-time inventory update trigger
export const onInventoryUpdate = onDocumentUpdated(
  {
    document: "inventory/{productId}",
    region: "europe-west1",
  },
  async (event) => {
    const before = event.data?.before.data() as InventoryUpdateItem;
    const after = event.data?.after.data() as InventoryUpdateItem;
    const productId = event.params.productId;

    try {
      // Check if stock level changed
      if (before?.quantity !== after?.quantity) {
        console.log(
          `Inventory updated for product ${productId}: ${before?.quantity} -> ${after?.quantity}`
        );

        // Update product status based on new quantity
        let status: "in_stock" | "low_stock" | "out_of_stock" = "in_stock";

        if (after.quantity <= 0) {
          status = "out_of_stock";
        } else if (after.quantity <= after.lowStockThreshold) {
          status = "low_stock";
        }

        // Update inventory status
        await db.collection("inventory").doc(productId).update({
          status,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Update product availability
        await db.collection("products").doc(productId).update({
          availability: status,
          stock: after.quantity,
          lastStockUpdate: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Send low stock notifications if needed
        if (status === "low_stock" || status === "out_of_stock") {
          await sendLowStockNotification(productId, after.quantity, status);
        }
      }
    } catch (error) {
      console.error("Error processing inventory update:", error);
    }
  }
);

// Helper function to send low stock notifications
async function sendLowStockNotification(
  productId: string,
  quantity: number,
  status: string
) {
  try {
    // Get product details
    const productDoc = await db.collection("products").doc(productId).get();
    const productData = productDoc.data();

    if (!productData) return;

    // Create notification for admins
    await db.collection("notifications").add({
      type: "low_stock",
      title: `Low Stock Alert: ${productData.name}`,
      message: `Product ${productData.name} is ${status}. Current stock: ${quantity}`,
      productId,
      priority: status === "out_of_stock" ? "high" : "medium",
      recipients: ["admin"],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
    });

    console.log(`Low stock notification sent for product ${productId}`);
  } catch (error) {
    console.error("Error sending low stock notification:", error);
  }
}

// Update bulk inventory (admin function)
export const updateBulkInventory = onCall(
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
      const { updates } = request.data;

      if (!Array.isArray(updates)) {
        throw new Error("Updates must be an array");
      }

      const batch = db.batch();
      const results = [];

      for (const update of updates) {
        const { productId, quantity } = update;

        if (!productId || quantity === undefined) {
          results.push({
            productId,
            success: false,
            error: "Product ID and quantity are required",
          });
          continue;
        }

        try {
          const inventoryRef = db.collection("inventory").doc(productId);

          batch.update(inventoryRef, {
            quantity,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          });

          results.push({
            productId,
            success: true,
            newQuantity: quantity,
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
        message: `Updated ${successCount}/${results.length} products`,
        results,
      };
    } catch (error) {
      console.error("Error updating bulk inventory:", error);
      throw new Error("Bulk inventory update failed");
    }
  }
);
