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
exports.scheduledStockUpdate = exports.batchUpdateBigBuyStock = exports.getBigBuyStock = exports.syncBigBuyProducts = void 0;
const functions = __importStar(require("firebase-functions"));
const scheduler_1 = require("firebase-functions/v2/scheduler");
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// Sync products from BigBuy API
exports.syncBigBuyProducts = functions.https.onCall(async (data, context) => {
    var _a, _b, _c, _d, _e, _f;
    // Verify admin access
    if (!context.auth || !context.auth.token.admin) {
        throw new functions.https.HttpsError("permission-denied", "Admin access required");
    }
    try {
        const { category, limit = 100 } = data;
        const apiKey = functions.config().bigbuy.api_key;
        if (!apiKey) {
            throw new functions.https.HttpsError("failed-precondition", "BigBuy API key not configured");
        }
        // Fetch products from BigBuy API
        const bigBuyUrl = new URL("https://api.bigbuy.eu/rest/catalog/products");
        if (category) {
            bigBuyUrl.searchParams.append("category", category);
        }
        bigBuyUrl.searchParams.append("limit", limit.toString());
        const response = await fetch(bigBuyUrl.toString(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new functions.https.HttpsError("internal", `BigBuy API error: ${response.status}`);
        }
        const bigBuyData = await response.json();
        const products = bigBuyData.products || [];
        const batch = db.batch();
        let syncedCount = 0;
        let updatedCount = 0;
        for (const bigBuyProduct of products) {
            try {
                // Transform BigBuy product to our format
                const productData = {
                    id: `bigbuy-${bigBuyProduct.id}`,
                    name: bigBuyProduct.name,
                    description: bigBuyProduct.description || "",
                    price: parseFloat(bigBuyProduct.retailPrice) || 0,
                    originalPrice: parseFloat(bigBuyProduct.wholeSalePrice) || undefined,
                    category: ((_a = bigBuyProduct.category) === null || _a === void 0 ? void 0 : _a.name) || "Uncategorized",
                    subcategory: (_b = bigBuyProduct.subcategory) === null || _b === void 0 ? void 0 : _b.name,
                    brand: (_c = bigBuyProduct.brand) === null || _c === void 0 ? void 0 : _c.name,
                    images: ((_d = bigBuyProduct.images) === null || _d === void 0 ? void 0 : _d.map((img) => img.url)) || [],
                    stock: parseInt(bigBuyProduct.stock) || 0,
                    active: bigBuyProduct.active === true,
                    weight: parseFloat(bigBuyProduct.weight) || undefined,
                    dimensions: bigBuyProduct.dimensions
                        ? {
                            length: parseFloat(bigBuyProduct.dimensions.length) || 0,
                            width: parseFloat(bigBuyProduct.dimensions.width) || 0,
                            height: parseFloat(bigBuyProduct.dimensions.height) || 0,
                        }
                        : undefined,
                    ean: bigBuyProduct.ean,
                    sku: bigBuyProduct.sku,
                    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                };
                // Check if product already exists
                const productRef = db.collection("products").doc(productData.id);
                const existingProduct = await productRef.get();
                if (existingProduct.exists) {
                    // Update existing product
                    batch.update(productRef, productData);
                    updatedCount++;
                }
                else {
                    // Create new product
                    batch.set(productRef, productData);
                    syncedCount++;
                }
                // Also update our local product collection for admin management
                const adminProductRef = db
                    .collection("admin_products")
                    .doc(productData.id);
                batch.set(adminProductRef, Object.assign(Object.assign({}, productData), { origin: "BigBuy", syncedAt: admin.firestore.FieldValue.serverTimestamp(), 
                    // Add SEO fields with defaults
                    metaTitle: `${productData.name} - Premium Quality`, metaDescription: ((_e = productData.description) === null || _e === void 0 ? void 0 : _e.substring(0, 160)) || "", slug: (_f = productData.name) === null || _f === void 0 ? void 0 : _f.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), imageAlt: productData.name, tags: ["premium", "quality"], inStock: productData.stock > 0, featured: false, sustainable: false, vegan: false, crueltyFree: false }), { merge: true });
            }
            catch (productError) {
                console.error(`Error processing product ${bigBuyProduct.id}:`, productError);
                // Continue with other products
            }
        }
        // Commit the batch
        await batch.commit();
        // Log sync activity
        await db.collection("sync_logs").add({
            type: "bigbuy_products",
            syncedCount,
            updatedCount,
            totalProcessed: products.length,
            category: category || "all",
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            performedBy: context.auth.uid,
        });
        return {
            success: true,
            syncedCount,
            updatedCount,
            totalProcessed: products.length,
        };
    }
    catch (error) {
        console.error("BigBuy sync error:", error);
        throw new functions.https.HttpsError("internal", "Sync failed");
    }
});
// Get BigBuy product stock
exports.getBigBuyStock = functions.https.onCall(async (data, context) => {
    try {
        const { productId } = data;
        const apiKey = functions.config().bigbuy.api_key;
        if (!productId) {
            throw new functions.https.HttpsError("invalid-argument", "Product ID required");
        }
        if (!apiKey) {
            throw new functions.https.HttpsError("failed-precondition", "BigBuy API key not configured");
        }
        // Extract BigBuy ID from our product ID
        const bigBuyId = productId.replace("bigbuy-", "");
        const response = await fetch(`https://api.bigbuy.eu/rest/catalog/products/${bigBuyId}/stock`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new functions.https.HttpsError("internal", `BigBuy API error: ${response.status}`);
        }
        const stockData = await response.json();
        // Update our local stock data
        await db
            .collection("products")
            .doc(productId)
            .update({
            stock: stockData.stock || 0,
            lastStockUpdate: admin.firestore.FieldValue.serverTimestamp(),
        });
        return {
            productId,
            stock: stockData.stock || 0,
            available: stockData.stock > 0,
        };
    }
    catch (error) {
        console.error("BigBuy stock check error:", error);
        throw new functions.https.HttpsError("internal", "Stock check failed");
    }
});
// Batch update stock for multiple products
exports.batchUpdateBigBuyStock = functions.https.onCall(async (data, context) => {
    if (!context.auth || !context.auth.token.admin) {
        throw new functions.https.HttpsError("permission-denied", "Admin access required");
    }
    try {
        const { productIds } = data;
        const apiKey = functions.config().bigbuy.api_key;
        if (!productIds || !Array.isArray(productIds)) {
            throw new functions.https.HttpsError("invalid-argument", "Product IDs array required");
        }
        if (!apiKey) {
            throw new functions.https.HttpsError("failed-precondition", "BigBuy API key not configured");
        }
        const results = [];
        const batch = db.batch();
        for (const productId of productIds.slice(0, 100)) {
            // Limit to 100 products per batch
            try {
                const bigBuyId = productId.replace("bigbuy-", "");
                const response = await fetch(`https://api.bigbuy.eu/rest/catalog/products/${bigBuyId}/stock`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    const stockData = await response.json();
                    const stock = stockData.stock || 0;
                    // Update in batch
                    const productRef = db.collection("products").doc(productId);
                    batch.update(productRef, {
                        stock,
                        lastStockUpdate: admin.firestore.FieldValue.serverTimestamp(),
                    });
                    results.push({
                        productId,
                        stock,
                        success: true,
                    });
                }
                else {
                    results.push({
                        productId,
                        success: false,
                        error: `API error: ${response.status}`,
                    });
                }
            }
            catch (productError) {
                const errorMessage = productError instanceof Error
                    ? productError.message
                    : "Unknown error";
                results.push({
                    productId,
                    success: false,
                    error: errorMessage,
                });
            }
        }
        // Commit batch updates
        await batch.commit();
        // Log batch update
        await db.collection("sync_logs").add({
            type: "batch_stock_update",
            totalProducts: productIds.length,
            successfulUpdates: results.filter((r) => r.success).length,
            failedUpdates: results.filter((r) => !r.success).length,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            performedBy: context.auth.uid,
        });
        return {
            success: true,
            results,
            totalProcessed: productIds.length,
            successfulUpdates: results.filter((r) => r.success).length,
        };
    }
    catch (error) {
        console.error("Batch stock update error:", error);
        throw new functions.https.HttpsError("internal", "Batch update failed");
    }
});
// Schedule automatic stock updates (runs every 6 hours)
exports.scheduledStockUpdate = (0, scheduler_1.onSchedule)({
    schedule: "every 6 hours",
    region: "europe-west1",
}, async (event) => {
    try {
        // Get all BigBuy products
        const productsSnapshot = await db
            .collection("products")
            .where("id", ">=", "bigbuy-")
            .where("id", "<", "bigbuy-\uf8ff")
            .limit(100) // Process in batches
            .get();
        const productIds = productsSnapshot.docs.map((doc) => doc.id);
        if (productIds.length === 0) {
            console.log("No BigBuy products found for stock update");
            return;
        }
        // Perform stock updates directly
        const apiKey = functions.config().bigbuy.api_key;
        if (!apiKey) {
            console.error("BigBuy API key not configured for scheduled update");
            return;
        }
        const results = [];
        const batch = db.batch();
        for (const productId of productIds) {
            try {
                // Extract BigBuy ID from our product ID format
                const bigbuyId = productId.replace("bigbuy-", "");
                // Get current stock from BigBuy API
                const stockResponse = await fetch(`https://api.bigbuy.eu/rest/catalog/productstock/${bigbuyId}.json`, {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                });
                if (stockResponse.ok) {
                    const stockData = await stockResponse.json();
                    const productRef = db.collection("products").doc(productId);
                    batch.update(productRef, {
                        stock: stockData.quantity || 0,
                        lastStockUpdate: admin.firestore.FieldValue.serverTimestamp(),
                    });
                    results.push({
                        productId,
                        success: true,
                        newStock: stockData.quantity || 0,
                    });
                }
                else {
                    results.push({
                        productId,
                        success: false,
                        error: `API error: ${stockResponse.status}`,
                    });
                }
            }
            catch (productError) {
                const errorMessage = productError instanceof Error
                    ? productError.message
                    : "Unknown error";
                results.push({
                    productId,
                    success: false,
                    error: errorMessage,
                });
            }
        }
        // Commit batch updates
        await batch.commit();
        const successfulUpdates = results.filter((r) => r.success).length;
        // Log the update
        await db.collection("sync_logs").add({
            type: "scheduled_stock_update",
            totalProducts: productIds.length,
            successfulUpdates,
            failedUpdates: results.filter((r) => !r.success).length,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            performedBy: "system",
        });
        console.log(`Scheduled stock update completed: ${successfulUpdates}/${productIds.length} products updated`);
    }
    catch (error) {
        console.error("Scheduled stock update failed:", error);
    }
});
//# sourceMappingURL=bigbuyAdmin.js.map