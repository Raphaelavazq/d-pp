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
exports.SupplierRegistry = void 0;
exports.importProductsFromSupplier = importProductsFromSupplier;
exports.syncStockFromSupplier = syncStockFromSupplier;
const admin = __importStar(require("firebase-admin"));
class SupplierRegistry {
    static register(name, supplier) {
        this.suppliers.set(name, supplier);
    }
    static get(name) {
        return this.suppliers.get(name);
    }
    static getAll() {
        return Array.from(this.suppliers.keys());
    }
}
exports.SupplierRegistry = SupplierRegistry;
SupplierRegistry.suppliers = new Map();
/**
 * Generic product import function that works with any registered supplier
 * @param supplierName - Name of the supplier (e.g., 'bigbuy')
 * @param products - Array of products to import
 * @param adminUid - Admin user ID for audit logging
 */
async function importProductsFromSupplier(supplierName, products, adminUid) {
    const db = admin.firestore();
    const batch = db.batch();
    const errors = [];
    let imported = 0;
    let updated = 0;
    try {
        for (const product of products) {
            try {
                const productId = `${supplierName}-${product.supplierProductId}`;
                const productRef = db.collection("products").doc(productId);
                const existingProduct = await productRef.get();
                const productData = Object.assign(Object.assign({}, product), { id: productId, origin: supplierName, lastSyncDate: admin.firestore.FieldValue.serverTimestamp(), importedBy: adminUid });
                if (existingProduct.exists) {
                    batch.update(productRef, productData);
                    updated++;
                }
                else {
                    batch.set(productRef, productData);
                    imported++;
                }
                // Create/update inventory record
                const inventoryRef = db.collection("inventory").doc(productId);
                batch.set(inventoryRef, {
                    productId,
                    quantity: product.stock,
                    supplier: supplierName,
                    reorderPoint: 10, // Default reorder point
                    cost: product.originalPrice || product.price * 0.7, // Estimate cost
                    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                }, { merge: true });
            }
            catch (productError) {
                console.error(`Error processing product ${product.id}:`, productError);
                errors.push(`Failed to process product ${product.name}: ${productError}`);
            }
        }
        await batch.commit();
        // Log the import activity
        await db.collection("import_logs").add({
            supplier: supplierName,
            imported,
            updated,
            totalProcessed: products.length,
            errors: errors.length,
            performedBy: adminUid,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        return {
            success: true,
            imported,
            updated,
            errors,
        };
    }
    catch (error) {
        console.error("Batch import failed:", error);
        return {
            success: false,
            imported: 0,
            updated: 0,
            errors: [`Batch import failed: ${error}`],
        };
    }
}
/**
 * Generic stock sync function for any supplier
 * @param supplierName - Name of the supplier
 * @param productIds - Array of product IDs to sync
 */
async function syncStockFromSupplier(supplierName, productIds) {
    const supplier = SupplierRegistry.get(supplierName);
    if (!supplier) {
        throw new Error(`Supplier ${supplierName} not found`);
    }
    const results = await supplier.syncStock(productIds);
    const db = admin.firestore();
    const batch = db.batch();
    for (const result of results) {
        if (result.success) {
            // Update product stock
            const productRef = db.collection("products").doc(result.productId);
            batch.update(productRef, {
                stock: result.stock,
                lastStockUpdate: admin.firestore.FieldValue.serverTimestamp(),
            });
            // Update inventory
            const inventoryRef = db.collection("inventory").doc(result.productId);
            batch.update(inventoryRef, {
                quantity: result.stock,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
    }
    await batch.commit();
    return {
        success: true,
        results,
    };
}
//# sourceMappingURL=supplierInterface.js.map