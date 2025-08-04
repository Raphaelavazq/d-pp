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
exports.updateBulkInventory = exports.onInventoryUpdate = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// Real-time inventory update trigger
exports.onInventoryUpdate = (0, firestore_1.onDocumentUpdated)({
    document: "inventory/{productId}",
    region: "europe-west1",
}, async (event) => {
    var _a, _b;
    const before = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before.data();
    const after = (_b = event.data) === null || _b === void 0 ? void 0 : _b.after.data();
    const productId = event.params.productId;
    try {
        // Check if stock level changed
        if ((before === null || before === void 0 ? void 0 : before.quantity) !== (after === null || after === void 0 ? void 0 : after.quantity)) {
            console.log(`Inventory updated for product ${productId}: ${before === null || before === void 0 ? void 0 : before.quantity} -> ${after === null || after === void 0 ? void 0 : after.quantity}`);
            // Update product status based on new quantity
            let status = "in_stock";
            if (after.quantity <= 0) {
                status = "out_of_stock";
            }
            else if (after.quantity <= after.lowStockThreshold) {
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
    }
    catch (error) {
        console.error("Error processing inventory update:", error);
    }
});
// Helper function to send low stock notifications
async function sendLowStockNotification(productId, quantity, status) {
    try {
        // Get product details
        const productDoc = await db.collection("products").doc(productId).get();
        const productData = productDoc.data();
        if (!productData)
            return;
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
    }
    catch (error) {
        console.error("Error sending low stock notification:", error);
    }
}
// Update bulk inventory (admin function)
exports.updateBulkInventory = (0, https_1.onCall)({ region: "europe-west1" }, async (request) => {
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
            }
            catch (error) {
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
    }
    catch (error) {
        console.error("Error updating bulk inventory:", error);
        throw new Error("Bulk inventory update failed");
    }
});
//# sourceMappingURL=inventoryUpdates.js.map