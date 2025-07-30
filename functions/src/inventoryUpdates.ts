import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

export interface InventoryItem {
  productId: string;
  supplierId: string;
  quantity: number;
  lowStockThreshold: number;
  lastUpdated: admin.firestore.Timestamp;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

// Real-time inventory update trigger
export const onInventoryUpdate = functions.firestore
  .document("inventory/{productId}")
  .onUpdate(async (change: any, context: any) => {
    const before = change.before.data() as InventoryItem;
    const after = change.after.data() as InventoryItem;
    const productId = context.params.productId;

    try {
      // Check if stock level changed
      if (before.quantity !== after.quantity) {
        // Determine new status
        let status: "in_stock" | "low_stock" | "out_of_stock";
        if (after.quantity === 0) {
          status = "out_of_stock";
        } else if (after.quantity <= after.lowStockThreshold) {
          status = "low_stock";
        } else {
          status = "in_stock";
        }

        // Update inventory status
        await change.after.ref.update({
          status,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Update product availability
        await db
          .collection("products")
          .doc(productId)
          .update({
            inStock: after.quantity > 0,
            inventory: after.quantity,
            inventoryStatus: status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

        // Send low stock alerts
        if (status === "low_stock" && before.status !== "low_stock") {
          await sendLowStockAlert(productId, after);
        }

        // Send out of stock alerts
        if (status === "out_of_stock" && before.status !== "out_of_stock") {
          await sendOutOfStockAlert(productId, after);
        }

        console.log(
          `Inventory updated for product ${productId}: ${before.quantity} -> ${after.quantity} (${status})`
        );
      }
    } catch (error) {
      console.error(
        `Error updating inventory for product ${productId}:`,
        error
      );
    }
  });

// Bulk inventory update
export const updateBulkInventory = functions.https.onCall(
  async (data: any, context: any) => {
    if (!context.auth || !context.auth.token.admin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Admin access required"
      );
    }

    try {
      const { updates } = data; // Array of { productId, quantity }

      const batch = db.batch();

      for (const update of updates) {
        const inventoryRef = db.collection("inventory").doc(update.productId);

        // Get current inventory
        const inventoryDoc = await inventoryRef.get();
        if (!inventoryDoc.exists) {
          console.warn(`Inventory not found for product ${update.productId}`);
          continue;
        }

        const currentInventory = inventoryDoc.data() as InventoryItem;

        // Determine new status
        let status: "in_stock" | "low_stock" | "out_of_stock";
        if (update.quantity === 0) {
          status = "out_of_stock";
        } else if (update.quantity <= currentInventory.lowStockThreshold) {
          status = "low_stock";
        } else {
          status = "in_stock";
        }

        // Update inventory
        batch.update(inventoryRef, {
          quantity: update.quantity,
          status,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Update product
        const productRef = db.collection("products").doc(update.productId);
        batch.update(productRef, {
          inStock: update.quantity > 0,
          inventory: update.quantity,
          inventoryStatus: status,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      await batch.commit();

      return {
        success: true,
        updatedCount: updates.length,
      };
    } catch (error) {
      console.error("Bulk inventory update error:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Bulk inventory update failed"
      );
    }
  }
);

// Sync inventory from supplier
export const syncInventoryFromSupplier = functions.https.onCall(
  async (data: any, context: any) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Authentication required"
      );
    }

    try {
      const { supplierId } = data;

      // Get supplier info
      const supplierDoc = await db
        .collection("suppliers")
        .doc(supplierId)
        .get();
      if (!supplierDoc.exists) {
        throw new functions.https.HttpsError("not-found", "Supplier not found");
      }

      const supplier = supplierDoc.data()!;

      // Fetch inventory from supplier API (mock implementation)
      const supplierInventory = await fetchSupplierInventory(
        supplierId,
        supplier.apiKey
      );

      const batch = db.batch();
      let updateCount = 0;

      for (const item of supplierInventory) {
        const inventoryRef = db.collection("inventory").doc(item.productId);

        // Check if inventory document exists
        const inventoryDoc = await inventoryRef.get();
        if (!inventoryDoc.exists) {
          console.warn(`Inventory not found for product ${item.productId}`);
          continue;
        }

        const currentInventory = inventoryDoc.data() as InventoryItem;

        // Only update if quantity changed
        if (currentInventory.quantity !== item.quantity) {
          let status: "in_stock" | "low_stock" | "out_of_stock";
          if (item.quantity === 0) {
            status = "out_of_stock";
          } else if (item.quantity <= currentInventory.lowStockThreshold) {
            status = "low_stock";
          } else {
            status = "in_stock";
          }

          batch.update(inventoryRef, {
            quantity: item.quantity,
            status,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          });

          updateCount++;
        }
      }

      await batch.commit();

      return {
        success: true,
        updatedCount: updateCount,
        totalChecked: supplierInventory.length,
      };
    } catch (error) {
      console.error("Supplier inventory sync error:", error);
      throw new functions.https.HttpsError("internal", "Inventory sync failed");
    }
  }
);

// Get low stock products
export const getLowStockProducts = functions.https.onCall(
  async (data: any, context: any) => {
    if (!context.auth || !context.auth.token.admin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Admin access required"
      );
    }

    try {
      const lowStockSnapshot = await db
        .collection("inventory")
        .where("status", "in", ["low_stock", "out_of_stock"])
        .orderBy("quantity", "asc")
        .limit(100)
        .get();

      const lowStockProducts = [];

      for (const doc of lowStockSnapshot.docs) {
        const inventory = doc.data() as InventoryItem;

        // Get product details
        const productDoc = await db
          .collection("products")
          .doc(inventory.productId)
          .get();
        if (productDoc.exists) {
          lowStockProducts.push({
            ...inventory,
            product: productDoc.data(),
          });
        }
      }

      return {
        success: true,
        products: lowStockProducts,
      };
    } catch (error) {
      console.error("Get low stock products error:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to get low stock products"
      );
    }
  }
);

// Mock function to simulate supplier inventory API
async function fetchSupplierInventory(supplierId: string, apiKey: string) {
  // In real implementation, this would call supplier's API
  const mockInventory = [
    { productId: "prod_1", quantity: 150 },
    { productId: "prod_2", quantity: 5 }, // Low stock
    { productId: "prod_3", quantity: 0 }, // Out of stock
  ];

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockInventory;
}

async function sendLowStockAlert(productId: string, inventory: InventoryItem) {
  console.log(
    `LOW STOCK ALERT: Product ${productId} has ${inventory.quantity} units remaining`
  );

  // Get admin users
  const adminUsersSnapshot = await db
    .collection("users")
    .where("role", "==", "admin")
    .get();

  // Create notification
  const batch = db.batch();

  adminUsersSnapshot.docs.forEach((adminDoc) => {
    const notificationRef = db.collection("notifications").doc();
    batch.set(notificationRef, {
      userId: adminDoc.id,
      type: "low_stock",
      title: "Low Stock Alert",
      message: `Product ${productId} is running low with only ${inventory.quantity} units remaining`,
      data: { productId, quantity: inventory.quantity },
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
}

async function sendOutOfStockAlert(
  productId: string,
  inventory: InventoryItem
) {
  console.log(`OUT OF STOCK ALERT: Product ${productId} is out of stock`);

  // Get admin users
  const adminUsersSnapshot = await db
    .collection("users")
    .where("role", "==", "admin")
    .get();

  // Create notification
  const batch = db.batch();

  adminUsersSnapshot.docs.forEach((adminDoc) => {
    const notificationRef = db.collection("notifications").doc();
    batch.set(notificationRef, {
      userId: adminDoc.id,
      type: "out_of_stock",
      title: "Out of Stock Alert",
      message: `Product ${productId} is now out of stock`,
      data: { productId },
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();

  // Disable product
  await db.collection("products").doc(productId).update({
    inStock: false,
    status: "inactive",
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

export const inventoryUpdates = {
  updateAllInventory: async () => {
    console.log("Updating all inventory from suppliers...");

    // Get all active suppliers
    const suppliersSnapshot = await db
      .collection("suppliers")
      .where("status", "==", "active")
      .get();

    for (const supplierDoc of suppliersSnapshot.docs) {
      const supplier = supplierDoc.data();
      try {
        await fetchSupplierInventory(supplierDoc.id, supplier.apiKey);
        console.log(`Updated inventory for supplier: ${supplier.name}`);
      } catch (error) {
        console.error(
          `Failed to update inventory for supplier ${supplier.name}:`,
          error
        );
      }
    }
  },
};
