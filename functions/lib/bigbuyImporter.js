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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledBigBuyStockSync = exports.syncBigBuyStock = exports.getBigBuyCategories = exports.getBigBuyProductDetails = exports.searchBigBuyProducts = void 0;
const https_1 = require("firebase-functions/v2/https");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const admin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
// BigBuy API Configuration
const BIGBUY_API_BASE = "https://api.bigbuy.eu";
// Use environment variable for modern Firebase Functions
const BIGBUY_API_KEY = process.env.BIGBUY_API_KEY;
// Helper function to create BigBuy API headers
const getBigBuyHeaders = () => ({
    Authorization: `Bearer ${BIGBUY_API_KEY}`,
    "Content-Type": "application/json",
});
// Search BigBuy products
exports.searchBigBuyProducts = (0, https_1.onCall)({ region: "europe-west1" }, async (request) => {
    var _a, _b, _c;
    const { data, auth } = request;
    // Check admin access
    if (!auth) {
        throw new Error("Authentication required");
    }
    if (!BIGBUY_API_KEY) {
        throw new Error("BigBuy API key not configured");
    }
    const { query = "", category = "", limit = 50, offset = 0 } = data;
    // Build search parameters
    const searchParams = {
        limit: Math.min(limit, 100), // Max 100 per request
        offset,
    };
    if (query) {
        searchParams.name = query;
    }
    if (category) {
        searchParams.category = category;
    }
    try {
        const response = await axios_1.default.get(`${BIGBUY_API_BASE}/rest/catalog/products`, {
            headers: getBigBuyHeaders(),
            params: searchParams,
            timeout: 30000, // 30 second timeout
        });
        if (response.status !== 200) {
            throw new Error(`BigBuy API returned status ${response.status}`);
        }
        const products = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.data) || [];
        // Transform products to our format
        const transformedProducts = products.map((product) => {
            var _a, _b, _c, _d, _e, _f;
            return ({
                id: product.id,
                name: product.name || "",
                description: product.description || "",
                shortDescription: product.shortDescription || "",
                price: parseFloat(product.retailPrice || 0),
                originalPrice: parseFloat(product.retailPrice || 0),
                wholesalePrice: parseFloat(product.wholesalePrice || 0),
                stock: parseInt(product.stock || 0),
                sku: product.sku || "",
                category: ((_a = product.category) === null || _a === void 0 ? void 0 : _a.name) || "",
                subcategory: ((_b = product.subcategory) === null || _b === void 0 ? void 0 : _b.name) || "",
                brand: ((_c = product.brand) === null || _c === void 0 ? void 0 : _c.name) || "",
                images: ((_d = product.images) === null || _d === void 0 ? void 0 : _d.map((img) => img.url)) || [],
                thumbnail: ((_f = (_e = product.images) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.url) || "",
                attributes: product.attributes || {},
                variations: product.variations || [],
                weight: parseFloat(product.weight || 0),
                dimensions: product.dimensions || {},
                warranty: product.warranty || "",
                minimumOrderQuantity: parseInt(product.minimumOrderQuantity || 1),
            });
        });
        console.log(`BigBuy product search completed: ${transformedProducts.length} products found`);
        return {
            success: true,
            data: transformedProducts,
            pagination: {
                total: ((_c = (_b = response.data) === null || _b === void 0 ? void 0 : _b.pagination) === null || _c === void 0 ? void 0 : _c.total) || 0,
                offset,
                limit,
            },
        };
    }
    catch (error) {
        console.error("BigBuy search error:", error.message);
        throw new Error(`Failed to search BigBuy products: ${error.message}`);
    }
});
// Get detailed product information from BigBuy
exports.getBigBuyProductDetails = (0, https_1.onCall)({ region: "europe-west1" }, async (request) => {
    var _a, _b, _c, _d, _e, _f;
    const { data, auth } = request;
    // Check admin access
    if (!auth) {
        throw new Error("Authentication required");
    }
    if (!BIGBUY_API_KEY) {
        throw new Error("BigBuy API key not configured");
    }
    const { productId } = data;
    if (!productId) {
        throw new Error("Product ID is required");
    }
    try {
        const response = await axios_1.default.get(`${BIGBUY_API_BASE}/rest/catalog/products/${productId}`, {
            headers: getBigBuyHeaders(),
            timeout: 15000,
        });
        if (response.status !== 200) {
            throw new Error(`BigBuy API returned status ${response.status}`);
        }
        const product = response.data;
        if (!product) {
            throw new Error("Product not found");
        }
        const transformedProduct = {
            id: product.id,
            name: product.name || "",
            description: product.description || "",
            shortDescription: product.shortDescription || "",
            price: parseFloat(product.retailPrice || 0),
            originalPrice: parseFloat(product.retailPrice || 0),
            wholesalePrice: parseFloat(product.wholesalePrice || 0),
            stock: parseInt(product.stock || 0),
            sku: product.sku || "",
            category: ((_a = product.category) === null || _a === void 0 ? void 0 : _a.name) || "",
            subcategory: ((_b = product.subcategory) === null || _b === void 0 ? void 0 : _b.name) || "",
            brand: ((_c = product.brand) === null || _c === void 0 ? void 0 : _c.name) || "",
            images: ((_d = product.images) === null || _d === void 0 ? void 0 : _d.map((img) => img.url)) || [],
            thumbnail: ((_f = (_e = product.images) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.url) || "",
            attributes: product.attributes || {},
            variations: product.variations || [],
            weight: parseFloat(product.weight || 0),
            dimensions: product.dimensions || {},
            warranty: product.warranty || "",
            minimumOrderQuantity: parseInt(product.minimumOrderQuantity || 1),
        };
        console.log(`BigBuy product details retrieved: ${productId}`, {
            productId,
            name: product.name,
        });
        return {
            success: true,
            data: transformedProduct,
        };
    }
    catch (error) {
        console.error("BigBuy product details error:", error.message);
        throw new Error(`Failed to get product details: ${error.message}`);
    }
});
// Get BigBuy categories
exports.getBigBuyCategories = (0, https_1.onCall)({ region: "europe-west1" }, async (request) => {
    var _a;
    const { auth } = request;
    // Check admin access
    if (!auth) {
        throw new Error("Authentication required");
    }
    if (!BIGBUY_API_KEY) {
        throw new Error("BigBuy API key not configured");
    }
    try {
        const response = await axios_1.default.get(`${BIGBUY_API_BASE}/rest/catalog/categories`, {
            headers: getBigBuyHeaders(),
            timeout: 15000,
        });
        if (response.status !== 200) {
            throw new Error(`BigBuy API returned status ${response.status}`);
        }
        const categories = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.data) || [];
        console.log(`BigBuy categories retrieved: ${categories.length} categories`);
        return {
            success: true,
            data: categories,
        };
    }
    catch (error) {
        console.error("BigBuy categories error:", error.message);
        throw new Error(`Failed to get categories: ${error.message}`);
    }
});
// Sync BigBuy stock for existing products
exports.syncBigBuyStock = (0, https_1.onCall)({ region: "europe-west1" }, async (request) => {
    const { auth } = request;
    // Check admin access
    if (!auth) {
        throw new Error("Authentication required");
    }
    if (!BIGBUY_API_KEY) {
        throw new Error("BigBuy API key not configured");
    }
    try {
        const db = admin.firestore();
        // Get all BigBuy products
        const snapshot = await db
            .collection("products")
            .where("origin", "==", "BigBuy")
            .where("status", "==", "active")
            .get();
        if (snapshot.empty) {
            return {
                success: true,
                message: "No BigBuy products found to sync",
                totalProcessed: 0,
            };
        }
        let updatedCount = 0;
        // Process in batches to avoid rate limits
        const batchSize = 10;
        for (let i = 0; i < snapshot.docs.length; i += batchSize) {
            const batch = snapshot.docs.slice(i, i + batchSize);
            await Promise.all(batch.map(async (doc) => {
                var _a;
                const productData = doc.data();
                const bigBuyId = productData.bigBuyId;
                if (!bigBuyId)
                    return;
                try {
                    const stockResponse = await axios_1.default.get(`${BIGBUY_API_BASE}/rest/catalog/products/${bigBuyId}/stock`, {
                        headers: getBigBuyHeaders(),
                        timeout: 15000,
                    });
                    if (stockResponse.status === 200) {
                        const currentStock = parseInt(((_a = stockResponse.data) === null || _a === void 0 ? void 0 : _a.quantity) || 0);
                        if (currentStock !== productData.stock) {
                            await doc.ref.update({
                                stock: currentStock,
                                inStock: currentStock > 0,
                                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                                lastStockSync: admin.firestore.FieldValue.serverTimestamp(),
                            });
                            updatedCount++;
                        }
                    }
                }
                catch (error) {
                    console.warn(`Failed to sync stock for product ${bigBuyId}:`, error.message);
                }
            }));
            // Add delay between batches to respect rate limits
            if (i + batchSize < snapshot.docs.length) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
        console.log(`BigBuy stock sync completed: ${updatedCount} products updated`);
        return {
            success: true,
            message: `Stock sync completed: ${updatedCount} products updated`,
            totalProcessed: snapshot.docs.length,
        };
    }
    catch (error) {
        console.error("BigBuy stock sync error:", error.message);
        throw new Error(`Failed to sync stock: ${error.message}`);
    }
});
// Scheduled stock sync (runs every hour)
exports.scheduledBigBuyStockSync = (0, scheduler_1.onSchedule)({
    schedule: "0 * * * *",
    region: "europe-west1",
}, async (event) => {
    console.log("Running scheduled BigBuy stock sync...");
    try {
        if (!BIGBUY_API_KEY) {
            console.warn("BigBuy API key not configured, skipping stock sync");
            return;
        }
        const db = admin.firestore();
        // Get all BigBuy products
        const snapshot = await db
            .collection("products")
            .where("origin", "==", "BigBuy")
            .where("status", "==", "active")
            .get();
        let updatedCount = 0;
        // Process in batches to avoid rate limits
        const batchSize = 10;
        for (let i = 0; i < snapshot.docs.length; i += batchSize) {
            const batch = snapshot.docs.slice(i, i + batchSize);
            await Promise.all(batch.map(async (doc) => {
                var _a;
                const productData = doc.data();
                const bigBuyId = productData.bigBuyId;
                if (!bigBuyId)
                    return;
                try {
                    const stockResponse = await axios_1.default.get(`${BIGBUY_API_BASE}/rest/catalog/products/${bigBuyId}/stock`, {
                        headers: getBigBuyHeaders(),
                        timeout: 15000,
                    });
                    if (stockResponse.status === 200) {
                        const currentStock = parseInt(((_a = stockResponse.data) === null || _a === void 0 ? void 0 : _a.quantity) || 0);
                        if (currentStock !== productData.stock) {
                            await doc.ref.update({
                                stock: currentStock,
                                inStock: currentStock > 0,
                                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                                lastStockSync: admin.firestore.FieldValue.serverTimestamp(),
                            });
                            updatedCount++;
                        }
                    }
                }
                catch (error) {
                    console.warn(`Failed to sync stock for product ${bigBuyId}:`, error.message);
                }
            }));
            // Add delay between batches to respect rate limits
            if (i + batchSize < snapshot.docs.length) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
        console.log(`Scheduled BigBuy stock sync completed: ${updatedCount} products updated`);
    }
    catch (error) {
        console.error("Scheduled BigBuy stock sync error:", error.message);
    }
});
//# sourceMappingURL=bigbuyImporter.js.map