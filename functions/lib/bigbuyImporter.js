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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledBigBuyStockSync = exports.syncBigBuyStock = exports.getBigBuyCategories = exports.getBigBuyProductDetails = exports.searchBigBuyProducts = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
// BigBuy API Configuration
const BIGBUY_API_BASE = "https://api.bigbuy.eu";
const BIGBUY_API_KEY = (_a = functions.config().bigbuy) === null || _a === void 0 ? void 0 : _a.api_key;
// Helper function to create BigBuy API headers
const getBigBuyHeaders = () => ({
    "Authorization": `Bearer ${BIGBUY_API_KEY}`,
    "Content-Type": "application/json",
});
// Set CORS headers
const setCORSHeaders = (res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Max-Age', '3600');
};
// Search BigBuy products
exports.searchBigBuyProducts = functions.https.onRequest(async (req, res) => {
    var _a, _b, _c;
    // Handle CORS
    setCORSHeaders(res);
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    try {
        // For HTTP requests, get auth from header instead of context
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            res.status(401).json({ success: false, error: "Authentication required" });
            return;
        }
        const token = authHeader.substring(7);
        const decodedToken = await admin.auth().verifyIdToken(token);
        // Check if user has admin role
        const userRecord = await admin.auth().getUser(decodedToken.uid);
        const customClaims = userRecord.customClaims;
        if (!(customClaims === null || customClaims === void 0 ? void 0 : customClaims.admin)) {
            res.status(403).json({ success: false, error: "Admin access required" });
            return;
        }
        if (!BIGBUY_API_KEY) {
            res.status(500).json({ success: false, error: "BigBuy API key not configured" });
            return;
        }
        const { query = "", category = "", limit = 50, offset = 0 } = req.body;
        // Build search parameters
        const searchParams = {
            limit: Math.min(limit, 100), // Max 100 per request
            offset,
        };
        if (query) {
            searchParams.search = query;
        }
        if (category) {
            searchParams.category = category;
        }
        // Make request to BigBuy API
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
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return ({
                id: product.id,
                name: product.name || "",
                description: product.description || "",
                shortDescription: product.shortDescription || "",
                price: parseFloat(product.retailPrice || product.price || 0),
                originalPrice: parseFloat(product.originalPrice || 0),
                wholesalePrice: parseFloat(product.wholesalePrice || product.price || 0),
                stock: parseInt(product.stock || 0),
                sku: product.sku || ((_a = product.id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
                category: ((_b = product.category) === null || _b === void 0 ? void 0 : _b.name) || "",
                subcategory: ((_c = product.subcategory) === null || _c === void 0 ? void 0 : _c.name) || "",
                brand: ((_d = product.brand) === null || _d === void 0 ? void 0 : _d.name) || "",
                images: ((_e = product.images) === null || _e === void 0 ? void 0 : _e.map((img) => img.url || img)) || [],
                thumbnail: ((_g = (_f = product.images) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.url) || ((_h = product.images) === null || _h === void 0 ? void 0 : _h[0]) || "",
                attributes: product.attributes || {},
                variations: product.variations || [],
                weight: parseFloat(product.weight || 0),
                dimensions: product.dimensions || {},
                warranty: product.warranty || "",
                minimumOrderQuantity: parseInt(product.minimumOrderQuantity || 1),
            });
        });
        functions.logger.info(`BigBuy search completed: ${transformedProducts.length} products found`, {
            query,
            category,
            resultCount: transformedProducts.length,
        });
        res.json({
            success: true,
            products: transformedProducts,
            total: ((_b = response.data) === null || _b === void 0 ? void 0 : _b.total) || transformedProducts.length,
            hasMore: (offset + transformedProducts.length) < (((_c = response.data) === null || _c === void 0 ? void 0 : _c.total) || 0),
        });
    }
    catch (error) {
        functions.logger.error("BigBuy search error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to search BigBuy products",
            products: [],
        });
    }
});
// Get detailed product information from BigBuy
exports.getBigBuyProductDetails = functions.https.onRequest(async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    // Handle CORS
    setCORSHeaders(res);
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    try {
        // For HTTP requests, get auth from header instead of context
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            res.status(401).json({ success: false, error: "Authentication required" });
            return;
        }
        const token = authHeader.substring(7);
        const decodedToken = await admin.auth().verifyIdToken(token);
        // Check if user has admin role
        const userRecord = await admin.auth().getUser(decodedToken.uid);
        const customClaims = userRecord.customClaims;
        if (!(customClaims === null || customClaims === void 0 ? void 0 : customClaims.admin)) {
            res.status(403).json({ success: false, error: "Admin access required" });
            return;
        }
        if (!BIGBUY_API_KEY) {
            res.status(500).json({ success: false, error: "BigBuy API key not configured" });
            return;
        }
        const { productId } = req.body;
        if (!productId) {
            res.status(400).json({ success: false, error: "Product ID is required" });
            return;
        }
        // Get detailed product info from BigBuy
        const response = await axios_1.default.get(`${BIGBUY_API_BASE}/rest/catalog/products/${productId}`, {
            headers: getBigBuyHeaders(),
            timeout: 30000,
        });
        if (response.status !== 200) {
            throw new Error(`BigBuy API returned status ${response.status}`);
        }
        const product = response.data;
        // Transform product data
        const transformedProduct = {
            id: product.id,
            name: product.name || "",
            description: product.description || "",
            shortDescription: product.shortDescription || "",
            price: parseFloat(product.retailPrice || product.price || 0),
            originalPrice: parseFloat(product.originalPrice || 0),
            wholesalePrice: parseFloat(product.wholesalePrice || product.price || 0),
            stock: parseInt(product.stock || 0),
            sku: product.sku || ((_a = product.id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
            category: ((_b = product.category) === null || _b === void 0 ? void 0 : _b.name) || "",
            subcategory: ((_c = product.subcategory) === null || _c === void 0 ? void 0 : _c.name) || "",
            brand: ((_d = product.brand) === null || _d === void 0 ? void 0 : _d.name) || "",
            images: ((_e = product.images) === null || _e === void 0 ? void 0 : _e.map((img) => img.url || img)) || [],
            thumbnail: ((_g = (_f = product.images) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.url) || ((_h = product.images) === null || _h === void 0 ? void 0 : _h[0]) || "",
            attributes: product.attributes || {},
            variations: product.variations || [],
            weight: parseFloat(product.weight || 0),
            dimensions: product.dimensions || {},
            warranty: product.warranty || "",
            minimumOrderQuantity: parseInt(product.minimumOrderQuantity || 1),
        };
        functions.logger.info(`BigBuy product details retrieved: ${productId}`, {
            productId,
            productName: transformedProduct.name,
        });
        res.json({
            success: true,
            product: transformedProduct,
        });
    }
    catch (error) {
        functions.logger.error("BigBuy product details error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to get product details",
        });
    }
});
// Get BigBuy categories
exports.getBigBuyCategories = functions.https.onRequest(async (req, res) => {
    var _a;
    // Handle CORS
    setCORSHeaders(res);
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    try {
        // For HTTP requests, get auth from header instead of context
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            res.status(401).json({ success: false, error: "Authentication required" });
            return;
        }
        const token = authHeader.substring(7);
        const decodedToken = await admin.auth().verifyIdToken(token);
        // Check if user has admin role
        const userRecord = await admin.auth().getUser(decodedToken.uid);
        const customClaims = userRecord.customClaims;
        if (!(customClaims === null || customClaims === void 0 ? void 0 : customClaims.admin)) {
            res.status(403).json({ success: false, error: "Admin access required" });
            return;
        }
        if (!BIGBUY_API_KEY) {
            res.status(500).json({ success: false, error: "BigBuy API key not configured" });
            return;
        }
        // Get categories from BigBuy
        const response = await axios_1.default.get(`${BIGBUY_API_BASE}/rest/catalog/categories`, {
            headers: getBigBuyHeaders(),
            timeout: 30000,
        });
        if (response.status !== 200) {
            throw new Error(`BigBuy API returned status ${response.status}`);
        }
        const categories = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.data) || [];
        functions.logger.info(`BigBuy categories retrieved: ${categories.length} categories`);
        res.json({
            success: true,
            categories: categories.map((cat) => ({
                id: cat.id,
                name: cat.name,
                parentId: cat.parentId || null,
                hasChildren: cat.hasChildren || false,
            })),
        });
    }
    catch (error) {
        functions.logger.error("BigBuy categories error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to get categories",
            categories: [],
        });
    }
});
// Sync stock levels for imported BigBuy products
exports.syncBigBuyStock = functions.https.onRequest(async (req, res) => {
    var _a;
    // Handle CORS
    setCORSHeaders(res);
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    try {
        // For HTTP requests, get auth from header instead of context
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            res.status(401).json({ success: false, error: "Authentication required" });
            return;
        }
        const token = authHeader.substring(7);
        const decodedToken = await admin.auth().verifyIdToken(token);
        // Check if user has admin role
        const userRecord = await admin.auth().getUser(decodedToken.uid);
        const customClaims = userRecord.customClaims;
        if (!(customClaims === null || customClaims === void 0 ? void 0 : customClaims.admin)) {
            res.status(403).json({ success: false, error: "Admin access required" });
            return;
        }
        if (!BIGBUY_API_KEY) {
            res.status(500).json({ success: false, error: "BigBuy API key not configured" });
            return;
        }
        const db = admin.firestore();
        const { productIds } = req.body;
        // Get BigBuy products from Firestore
        let query = db.collection("products").where("origin", "==", "BigBuy");
        if (productIds && productIds.length > 0) {
            query = query.where("bigBuyId", "in", productIds);
        }
        const snapshot = await query.get();
        const updates = [];
        for (const doc of snapshot.docs) {
            const productData = doc.data();
            const bigBuyId = productData.bigBuyId;
            if (!bigBuyId)
                continue;
            try {
                // Get current stock from BigBuy
                const stockResponse = await axios_1.default.get(`${BIGBUY_API_BASE}/rest/catalog/products/${bigBuyId}/stock`, {
                    headers: getBigBuyHeaders(),
                    timeout: 15000,
                });
                if (stockResponse.status === 200) {
                    const currentStock = parseInt(((_a = stockResponse.data) === null || _a === void 0 ? void 0 : _a.quantity) || 0);
                    // Update Firestore if stock has changed
                    if (currentStock !== productData.stock) {
                        updates.push(doc.ref.update({
                            stock: currentStock,
                            inStock: currentStock > 0,
                            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                            lastStockSync: admin.firestore.FieldValue.serverTimestamp(),
                        }));
                    }
                }
            }
            catch (stockError) {
                functions.logger.warn(`Failed to sync stock for product ${bigBuyId}:`, stockError);
            }
        }
        await Promise.all(updates);
        functions.logger.info(`BigBuy stock sync completed: ${updates.length} products updated`);
        res.json({
            success: true,
            updatedCount: updates.length,
            totalProcessed: snapshot.docs.length,
        });
    }
    catch (error) {
        functions.logger.error("BigBuy stock sync error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to sync stock",
        });
    }
});
// Scheduled stock sync (runs every hour)
exports.scheduledBigBuyStockSync = functions.pubsub
    .schedule("0 * * * *") // Every hour
    .timeZone("UTC")
    .onRun(async (context) => {
    functions.logger.info("Running scheduled BigBuy stock sync...");
    try {
        if (!BIGBUY_API_KEY) {
            functions.logger.warn("BigBuy API key not configured, skipping stock sync");
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
                    functions.logger.warn(`Failed to sync stock for product ${bigBuyId}:`, error);
                }
            }));
            // Add delay between batches to respect rate limits
            if (i + batchSize < snapshot.docs.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        functions.logger.info(`Scheduled BigBuy stock sync completed: ${updatedCount} products updated`);
    }
    catch (error) {
        functions.logger.error("Scheduled BigBuy stock sync error:", error);
    }
});
//# sourceMappingURL=bigbuyImporter.js.map