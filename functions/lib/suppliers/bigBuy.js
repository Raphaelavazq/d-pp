"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigBuySupplier = void 0;
const supplierInterface_1 = require("./supplierInterface");
class BigBuySupplier {
    constructor() {
        this.name = "BigBuy";
        this.isConfigured = false;
        // Use Firebase config for now (deprecated but still works)
        this.apiKey = process.env.BIGBUY_API_KEY || "";
        this.apiUrl = process.env.BIGBUY_API_URL || "https://api.bigbuy.eu/rest";
        if (!this.apiKey) {
            console.warn("BigBuy API key not configured - supplier will be unavailable");
            this.isConfigured = false;
            return;
        }
        this.isConfigured = true;
    }
    getHeaders() {
        return {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
        };
    }
    transformProduct(bigBuyProduct) {
        var _a, _b, _c, _d;
        return {
            id: bigBuyProduct.id.toString(),
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
            supplier: "bigbuy",
            supplierProductId: bigBuyProduct.id.toString(),
        };
    }
    async searchProducts(query, category, limit = 50) {
        try {
            const searchParams = new URLSearchParams({
                limit: Math.min(limit, 100).toString(),
            });
            if (query) {
                searchParams.append("search", query);
            }
            if (category) {
                searchParams.append("category", category);
            }
            const response = await fetch(`${this.apiUrl}/catalog/products?${searchParams}`, {
                method: "GET",
                headers: this.getHeaders(),
            });
            if (!response.ok) {
                throw new Error(`BigBuy API error: ${response.status}`);
            }
            const data = await response.json();
            const products = data.products || [];
            return products.map((product) => this.transformProduct(product));
        }
        catch (error) {
            console.error("BigBuy search error:", error);
            throw error;
        }
    }
    async getProductDetails(productId) {
        try {
            const response = await fetch(`${this.apiUrl}/catalog/products/${productId}`, {
                method: "GET",
                headers: this.getHeaders(),
            });
            if (!response.ok) {
                throw new Error(`BigBuy API error: ${response.status}`);
            }
            const product = await response.json();
            return this.transformProduct(product);
        }
        catch (error) {
            console.error("BigBuy product details error:", error);
            throw error;
        }
    }
    async checkStock(productId) {
        try {
            const response = await fetch(`${this.apiUrl}/catalog/products/${productId}/stock`, {
                method: "GET",
                headers: this.getHeaders(),
            });
            if (!response.ok) {
                throw new Error(`BigBuy API error: ${response.status}`);
            }
            const stockData = await response.json();
            return stockData.quantity || 0;
        }
        catch (error) {
            console.error("BigBuy stock check error:", error);
            throw error;
        }
    }
    async syncStock(productIds) {
        const results = [];
        for (const productId of productIds.slice(0, 100)) {
            // Limit batch size
            try {
                // Extract BigBuy ID from our product ID format
                const bigBuyId = productId.replace("bigbuy-", "");
                const stock = await this.checkStock(bigBuyId);
                results.push({
                    productId,
                    stock,
                    success: true,
                });
            }
            catch (error) {
                console.error(`Failed to sync stock for ${productId}:`, error);
                results.push({
                    productId,
                    stock: 0,
                    success: false,
                });
            }
        }
        return results;
    }
    async getCategories() {
        try {
            const response = await fetch(`${this.apiUrl}/catalog/categories`, {
                method: "GET",
                headers: this.getHeaders(),
            });
            if (!response.ok) {
                throw new Error(`BigBuy API error: ${response.status}`);
            }
            const data = await response.json();
            const categories = data.categories || [];
            return categories.map((cat) => ({
                id: cat.id.toString(),
                name: cat.name,
                parentId: cat.parentId ? cat.parentId.toString() : undefined,
            }));
        }
        catch (error) {
            console.error("BigBuy categories error:", error);
            throw error;
        }
    }
}
exports.BigBuySupplier = BigBuySupplier;
// Register BigBuy supplier
try {
    const bigBuySupplier = new BigBuySupplier();
    if (bigBuySupplier.isConfigured) {
        supplierInterface_1.SupplierRegistry.register("bigbuy", bigBuySupplier);
        console.log("BigBuy supplier registered successfully");
    }
    else {
        console.log("BigBuy supplier not registered - API key not available");
    }
}
catch (error) {
    console.error("Failed to register BigBuy supplier:", error);
}
//# sourceMappingURL=bigBuy.js.map