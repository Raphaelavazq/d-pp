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
exports.updateInventoryQuantity = exports.getInventoryOverview = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const adminValidation_1 = require("./utils/adminValidation");
// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
/**
 * Get inventory overview with pagination and filtering
 */
exports.getInventoryOverview = (0, https_1.onCall)({ region: "europe-west1" }, async (request) => {
    var _a;
    await (0, adminValidation_1.validateAdminAccess)(request.auth);
    try {
        const { page = 1, limit = 20, status, lowStock = false } = request.data;
        let query = db.collection("inventory");
        if (status) {
            query = query.where("status", "==", status);
        }
        if (lowStock) {
            query = query.where("quantity", "<=", 10);
        }
        const snapshot = await query
            .orderBy("lastUpdated", "desc")
            .limit(limit)
            .offset((page - 1) * limit)
            .get();
        const items = [];
        for (const doc of snapshot.docs) {
            const data = doc.data();
            items.push(Object.assign(Object.assign({}, data), { productId: doc.id }));
        }
        await (0, adminValidation_1.logAdminAction)((_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid, "getInventoryOverview", {
            page,
            limit,
            status,
            lowStock,
        });
        return {
            success: true,
            data: { items },
        };
    }
    catch (error) {
        console.error("Error getting inventory overview:", error);
        throw new Error("Failed to get inventory overview");
    }
});
/**
 * Update inventory quantity for a specific product
 */
exports.updateInventoryQuantity = (0, https_1.onCall)({ region: "europe-west1" }, async (request) => {
    var _a;
    await (0, adminValidation_1.validateAdminAccess)(request.auth);
    try {
        const { productId, quantity, reason = "Manual adjustment", } = request.data;
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
            status: quantity <= 0
                ? "out_of_stock"
                : quantity <= 10
                    ? "low_stock"
                    : "in_stock",
        });
        await (0, adminValidation_1.logAdminAction)((_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid, "updateInventoryQuantity", {
            productId,
            quantity,
            reason,
        });
        return {
            success: true,
            message: "Inventory updated successfully",
        };
    }
    catch (error) {
        console.error("Error updating inventory quantity:", error);
        throw new Error("Failed to update inventory quantity");
    }
});
//# sourceMappingURL=admin-inventory.js.map