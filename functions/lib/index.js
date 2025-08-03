"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledAnalytics = exports.scheduledInventoryUpdate = exports.scheduledProductSync = exports.healthCheck = exports.scheduledBigBuyStockSync = exports.syncBigBuyStock = exports.getBigBuyCategories = exports.getBigBuyProductDetails = exports.searchBigBuyProducts = exports.scheduledStockUpdate = exports.batchUpdateBigBuyStock = exports.getBigBuyStock = exports.syncBigBuyProducts = exports.checkBigBuyStock = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin
admin.initializeApp();
// Import specific functions instead of wildcard exports
require("./productSync");
require("./orderProcessing");
require("./inventoryUpdates");
require("./userTriggers");
require("./notifications");
require("./analytics");
// Import BigBuy stock API
var bigbuyStock_1 = require("./bigbuyStock");
Object.defineProperty(exports, "checkBigBuyStock", { enumerable: true, get: function () { return bigbuyStock_1.checkBigBuyStock; } });
// Import BigBuy admin functions
var bigbuyAdmin_1 = require("./bigbuyAdmin");
Object.defineProperty(exports, "syncBigBuyProducts", { enumerable: true, get: function () { return bigbuyAdmin_1.syncBigBuyProducts; } });
Object.defineProperty(exports, "getBigBuyStock", { enumerable: true, get: function () { return bigbuyAdmin_1.getBigBuyStock; } });
Object.defineProperty(exports, "batchUpdateBigBuyStock", { enumerable: true, get: function () { return bigbuyAdmin_1.batchUpdateBigBuyStock; } });
Object.defineProperty(exports, "scheduledStockUpdate", { enumerable: true, get: function () { return bigbuyAdmin_1.scheduledStockUpdate; } });
// Import BigBuy importer functions
var bigbuyImporter_1 = require("./bigbuyImporter");
Object.defineProperty(exports, "searchBigBuyProducts", { enumerable: true, get: function () { return bigbuyImporter_1.searchBigBuyProducts; } });
Object.defineProperty(exports, "getBigBuyProductDetails", { enumerable: true, get: function () { return bigbuyImporter_1.getBigBuyProductDetails; } });
Object.defineProperty(exports, "getBigBuyCategories", { enumerable: true, get: function () { return bigbuyImporter_1.getBigBuyCategories; } });
Object.defineProperty(exports, "syncBigBuyStock", { enumerable: true, get: function () { return bigbuyImporter_1.syncBigBuyStock; } });
Object.defineProperty(exports, "scheduledBigBuyStockSync", { enumerable: true, get: function () { return bigbuyImporter_1.scheduledBigBuyStockSync; } });
// Health check function
exports.healthCheck = functions.https.onRequest((request, response) => {
    response.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});
// Scheduled functions
exports.scheduledProductSync = functions.pubsub
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
    }
    catch (error) {
        console.error("Error in scheduled product sync:", error);
    }
});
exports.scheduledInventoryUpdate = functions.pubsub
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
    }
    catch (error) {
        console.error("Error in scheduled inventory update:", error);
    }
});
exports.scheduledAnalytics = functions.pubsub
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
    }
    catch (error) {
        console.error("Error in daily analytics:", error);
    }
});
//# sourceMappingURL=index.js.map