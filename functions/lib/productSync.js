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
exports.productSync = exports.syncSingleProduct = exports.syncProductsFromAliExpress = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
exports.syncProductsFromAliExpress = functions.https.onCall(async (data, context) => {
    // Verify admin authentication
    if (!context.auth || !context.auth.token.admin) {
        throw new functions.https.HttpsError("permission-denied", "Admin access required");
    }
    try {
        const { supplierId, apiKey, category } = data;
        // Fetch products from AliExpress API (mock implementation)
        const products = await fetchAliExpressProducts(supplierId, apiKey, category);
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
                const productData = Object.assign(Object.assign({}, product), { updatedAt: admin.firestore.FieldValue.serverTimestamp(), syncedAt: admin.firestore.FieldValue.serverTimestamp(), status: "active" });
                batch.set(productRef, productData, { merge: true });
                // Update inventory
                const inventoryRef = db.collection("inventory").doc(product.id);
                batch.set(inventoryRef, {
                    productId: product.id,
                    supplierId: product.supplierId,
                    quantity: product.inventory,
                    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                    lowStockThreshold: 10,
                }, { merge: true });
                successCount++;
            }
            catch (error) {
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
    }
    catch (error) {
        console.error("Product sync error:", error);
        throw new functions.https.HttpsError("internal", "Product sync failed");
    }
});
exports.syncSingleProduct = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Authentication required");
    }
    try {
        const { productId, supplierId } = data;
        // Fetch single product from AliExpress
        const product = await fetchSingleAliExpressProduct(productId, supplierId);
        if (!product) {
            throw new functions.https.HttpsError("not-found", "Product not found");
        }
        const productRef = db.collection("products").doc(productId);
        await productRef.set(Object.assign(Object.assign({}, product), { updatedAt: admin.firestore.FieldValue.serverTimestamp(), syncedAt: admin.firestore.FieldValue.serverTimestamp() }), { merge: true });
        // Update inventory
        const inventoryRef = db.collection("inventory").doc(productId);
        await inventoryRef.set({
            productId: product.id,
            supplierId: product.supplierId,
            quantity: product.inventory,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            lowStockThreshold: 10,
        }, { merge: true });
        return { success: true, product };
    }
    catch (error) {
        console.error("Single product sync error:", error);
        throw new functions.https.HttpsError("internal", "Product sync failed");
    }
});
// Mock function to simulate AliExpress API call
async function fetchAliExpressProducts(supplierId, apiKey, category) {
    // In a real implementation, this would call the actual AliExpress API
    // For now, we'll return mock data
    const mockProducts = [
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
async function fetchSingleAliExpressProduct(productId, supplierId) {
    // Mock implementation
    const products = await fetchAliExpressProducts(supplierId, "mock-api-key");
    return products.find((p) => p.id === productId) || null;
}
exports.productSync = {
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
            }
            catch (error) {
                console.error(`Failed to sync products for supplier ${supplier.name}:`, error);
            }
        }
    },
};
//# sourceMappingURL=productSync.js.map