import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

// Import specific functions instead of wildcard exports
import "./productSync";
import "./orderProcessing";
import "./inventoryUpdates";
import "./userTriggers";
import "./notifications";
import "./analytics";

// Import BigBuy stock API
export { checkBigBuyStock } from "./bigbuyStock";

// Import BigBuy admin functions
export {
  syncBigBuyProducts,
  getBigBuyStock,
  batchUpdateBigBuyStock,
  scheduledStockUpdate,
} from "./bigbuyAdmin";

// Import BigBuy importer functions
export {
  searchBigBuyProducts,
  getBigBuyProductDetails,
  getBigBuyCategories,
  syncBigBuyStock,
  scheduledBigBuyStockSync,
} from "./bigbuyImporter";

// Health check function
export const healthCheck = functions.https.onRequest((request, response) => {
  response.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Scheduled functions
export const scheduledProductSync = functions.pubsub
  .schedule("0 */6 * * *") // Every 6 hours
  .timeZone("UTC")
  .onRun(async (context) => {
    console.log("Running scheduled product sync...");
    // This will trigger the product sync for all active suppliers
    const db = admin.firestore();

    try {
      const suppliersSnapshot = await db
        .collection("suppliers")
        .where("status", "==", "active")
        .where("autoSync", "==", true)
        .get();

      const syncPromises = suppliersSnapshot.docs.map(async (doc) => {
        const supplier = doc.data();
        // Call the product sync function for each supplier
        // This would normally call the syncProductsFromAliExpress function
        console.log(`Syncing products for supplier: ${supplier.name}`);
      });

      await Promise.all(syncPromises);
      console.log("Scheduled product sync completed successfully");
    } catch (error) {
      console.error("Error in scheduled product sync:", error);
    }
  });

export const scheduledInventoryUpdate = functions.pubsub
  .schedule("*/30 * * * *") // Every 30 minutes
  .timeZone("UTC")
  .onRun(async (context) => {
    console.log("Running scheduled inventory update...");
    // This will check and update inventory levels
    const db = admin.firestore();

    try {
      const productsSnapshot = await db
        .collection("products")
        .where("status", "==", "active")
        .get();

      const updatePromises = productsSnapshot.docs.map(async (doc) => {
        const product = doc.data();
        const inventoryDoc = await db.collection("inventory").doc(doc.id).get();

        if (inventoryDoc.exists) {
          const inventory = inventoryDoc.data();
          if (inventory && inventory.quantity <= inventory.lowStockThreshold) {
            console.log(`Low stock detected for product: ${product.name}`);
            // Trigger low stock notification
          }
        }
      });

      await Promise.all(updatePromises);
      console.log("Scheduled inventory update completed successfully");
    } catch (error) {
      console.error("Error in scheduled inventory update:", error);
    }
  });

export const scheduledAnalytics = functions.pubsub
  .schedule("0 0 * * *") // Daily at midnight
  .timeZone("UTC")
  .onRun(async (context) => {
    console.log("Running daily analytics aggregation...");
    // This will aggregate daily analytics data
    const db = admin.firestore();

    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateString = yesterday.toISOString().split("T")[0];

      // Aggregate daily metrics
      const ordersSnapshot = await db
        .collection("orders")
        .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(yesterday))
        .where("createdAt", "<", admin.firestore.Timestamp.fromDate(new Date()))
        .get();

      let totalRevenue = 0;
      let totalOrders = ordersSnapshot.size;

      ordersSnapshot.docs.forEach((doc) => {
        const order = doc.data();
        totalRevenue += order.total || 0;
      });

      // Store aggregated data
      await db
        .collection("analytics")
        .doc(dateString)
        .set({
          date: dateString,
          totalRevenue,
          totalOrders,
          averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
          createdAt: new Date(),
        });

      console.log(`Daily analytics completed for ${dateString}`);
    } catch (error) {
      console.error("Error in daily analytics:", error);
    }
  });
