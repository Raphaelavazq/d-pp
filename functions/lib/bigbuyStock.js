"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBigBuyStock = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const axios_1 = __importDefault(require("axios"));
// Define the secret parameter for production security
const bigBuyApiKey = (0, params_1.defineSecret)("BIGBUY_API_KEY");
/**
 * GDPR-compliant BigBuy stock checker
 * - Only fetches stock information, no personal data
 * - No logging of user-specific queries
 * - No caching of user-related data
 * - Secure API key handling
 * - EU region deployment for GDPR compliance
 */
exports.checkBigBuyStock = (0, https_1.onRequest)({
    region: "europe-west1", // EU region for GDPR compliance
    secrets: [bigBuyApiKey], // Secure secret handling
    cors: [
        "https://dupp-store.web.app",
        "https://dupp-store.firebaseapp.com",
        "http://localhost:5173", // Vite dev server
        "http://localhost:3000", // Alternative dev port
    ],
}, async (request, response) => {
    try {
        // Security headers for GDPR compliance
        response.set({
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Content-Security-Policy": "default-src 'none'",
        });
        // Only allow GET requests
        if (request.method !== "GET") {
            response.status(405).json({
                error: "Method not allowed",
                inStock: false,
                availableQuantity: 0,
            });
            return;
        }
        const { productId } = request.query;
        // Validate required parameters with security checks
        if (!productId || typeof productId !== "string") {
            response.status(400).json({
                error: "Product ID is required",
                inStock: false,
                availableQuantity: 0,
            });
            return;
        }
        // Input sanitization - only allow alphanumeric and hyphens
        if (!/^[a-zA-Z0-9\-_]+$/.test(productId)) {
            response.status(400).json({
                error: "Invalid product ID format",
                inStock: false,
                availableQuantity: 0,
            });
            return;
        }
        // Rate limiting check - basic monitoring
        // Note: In production, implement proper rate limiting with Redis/Firestore
        // Log request for monitoring (no personal data)
        console.log("Stock check request:", {
            productId: productId.substring(0, 10) + "...", // Truncated for privacy
            timestamp: new Date().toISOString(),
            region: "EU",
            source: "authenticated",
        });
        // Get BigBuy API credentials from environment
        // Access the API key securely from Secret Manager
        const apiKey = bigBuyApiKey.value();
        const apiUrl = process.env.BIGBUY_API_URL || "https://api.bigbuy.eu/rest";
        if (!apiKey) {
            console.error("BigBuy API key not configured in environment");
            response.status(500).json({
                error: "Service temporarily unavailable",
                inStock: false,
                availableQuantity: 0,
            });
            return;
        }
        // Fetch stock data from BigBuy API with security measures
        // Note: We only send the product ID, no user data
        const bigbuyResponse = await axios_1.default.get(`${apiUrl}/catalog/productStock.json`, {
            params: { id: productId },
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "User-Agent": "dupp-store/1.0 GDPR-compliant",
                Accept: "application/json",
            },
            timeout: 5000, // 5 second timeout for fast response
            maxRedirects: 0, // No redirects for security
            validateStatus: (status) => status >= 200 && status < 300,
        });
        const stockData = bigbuyResponse.data;
        // Validate response structure
        if (!stockData || typeof stockData.stock !== "number") {
            throw new Error("Invalid API response structure");
        }
        // Determine stock status based on BigBuy response
        const inStock = stockData.stock > 0 && stockData.status === "active";
        const availableQuantity = Math.max(0, stockData.stock || 0);
        const stockResponse = {
            inStock,
            availableQuantity,
            productId: productId,
            timestamp: new Date().toISOString(),
        };
        // GDPR-compliant cache headers (short cache, no personal data)
        response.set({
            "Cache-Control": "public, max-age=300, s-maxage=300", // 5 minutes
            Vary: "Accept, Accept-Encoding",
            ETag: `"${productId}-${inStock}-${Date.now()}"`,
        });
        response.status(200).json(stockResponse);
    }
    catch (error) {
        // Secure error logging without exposing sensitive information
        const errorId = Math.random().toString(36).substring(2, 15);
        console.error("BigBuy stock check failed:", {
            errorId,
            productId: request.query.productId
                ? String(request.query.productId).substring(0, 10) + "..."
                : "unknown",
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
            // No API keys, user data, or sensitive info logged
        });
        // Always return safe fallback for failed requests
        response.status(200).json({
            inStock: false,
            availableQuantity: 0,
            productId: request.query.productId || "",
            timestamp: new Date().toISOString(),
            error: `Stock information temporarily unavailable (ref: ${errorId})`,
        });
    }
});
//# sourceMappingURL=bigbuyStock.js.map