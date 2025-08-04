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
exports.getDashboardAnalytics = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const adminValidation_1 = require("./utils/adminValidation");
// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
/**
 * Get comprehensive dashboard analytics for admin
 */
exports.getDashboardAnalytics = (0, https_1.onCall)({ region: "europe-west1" }, async (request) => {
    var _a;
    await (0, adminValidation_1.validateAdminAccess)(request.auth);
    try {
        const { period = "30d" } = request.data;
        const now = new Date();
        const startDate = new Date();
        const previousStartDate = new Date();
        // Calculate date ranges
        switch (period) {
            case "7d":
                startDate.setDate(now.getDate() - 7);
                previousStartDate.setDate(now.getDate() - 14);
                break;
            case "30d":
                startDate.setDate(now.getDate() - 30);
                previousStartDate.setDate(now.getDate() - 60);
                break;
            case "90d":
                startDate.setDate(now.getDate() - 90);
                previousStartDate.setDate(now.getDate() - 180);
                break;
            default:
                startDate.setDate(now.getDate() - 30);
                previousStartDate.setDate(now.getDate() - 60);
        }
        // Get all orders in the period
        const ordersSnapshot = await db
            .collection("orders")
            .where("createdAt", ">=", startDate)
            .orderBy("createdAt", "desc")
            .get();
        // Get previous period orders for comparison
        const previousOrdersSnapshot = await db
            .collection("orders")
            .where("createdAt", ">=", previousStartDate)
            .where("createdAt", "<", startDate)
            .get();
        // Get products for stock analysis
        const productsSnapshot = await db.collection("products").get();
        // Get all users for customer count
        const usersSnapshot = await db.collection("users").get();
        // Calculate current period metrics
        let totalRevenue = 0;
        let totalOrders = ordersSnapshot.size;
        const productSales = {};
        const recentOrders = [];
        const dailyRevenue = {};
        ordersSnapshot.forEach((doc) => {
            var _a, _b;
            const order = doc.data();
            const orderAmount = order.amount || 0;
            totalRevenue += orderAmount;
            // Track recent orders (last 10)
            if (recentOrders.length < 10) {
                recentOrders.push({
                    id: doc.id,
                    customerEmail: order.customerEmail,
                    amount: orderAmount,
                    status: order.status,
                    createdAt: (_a = order.createdAt) === null || _a === void 0 ? void 0 : _a.toDate(),
                });
            }
            // Track daily revenue
            const orderDate = (_b = order.createdAt) === null || _b === void 0 ? void 0 : _b.toDate().toISOString().split("T")[0];
            if (!dailyRevenue[orderDate]) {
                dailyRevenue[orderDate] = { revenue: 0, orders: 0 };
            }
            dailyRevenue[orderDate].revenue += orderAmount;
            dailyRevenue[orderDate].orders += 1;
            // Track product sales
            if (order.items) {
                order.items.forEach((item) => {
                    if (!productSales[item.id]) {
                        productSales[item.id] = {
                            name: item.name,
                            sales: 0,
                            revenue: 0,
                        };
                    }
                    productSales[item.id].sales += item.quantity;
                    productSales[item.id].revenue += item.price * item.quantity;
                });
            }
        });
        // Calculate previous period metrics
        let previousRevenue = 0;
        const previousOrders = previousOrdersSnapshot.size;
        previousOrdersSnapshot.forEach((doc) => {
            const order = doc.data();
            previousRevenue += order.amount || 0;
        });
        // Calculate growth percentages
        const revenueGrowth = previousRevenue > 0
            ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
            : 0;
        const orderGrowth = previousOrders > 0
            ? ((totalOrders - previousOrders) / previousOrders) * 100
            : 0;
        // Get top products
        const topProducts = Object.entries(productSales)
            .map(([id, data]) => (Object.assign({ id }, data)))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
        // Get low stock products
        const lowStockProducts = [];
        productsSnapshot.forEach((doc) => {
            var _a, _b;
            const product = doc.data();
            const stock = ((_a = product.inventory) === null || _a === void 0 ? void 0 : _a.quantity) || 0;
            if (stock < (((_b = product.inventory) === null || _b === void 0 ? void 0 : _b.reorderPoint) || 10)) {
                lowStockProducts.push({
                    id: doc.id,
                    name: product.name,
                    stock,
                });
            }
        });
        // Format daily revenue data
        const dailyRevenueArray = Object.entries(dailyRevenue)
            .map(([date, data]) => (Object.assign({ date }, data)))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const customerGrowth = 0; // Would need historical user data for accurate calculation
        const metrics = {
            totalRevenue,
            totalOrders,
            totalCustomers: usersSnapshot.size,
            activeProducts: productsSnapshot.size,
            averageOrderValue,
            revenueGrowth,
            orderGrowth,
            customerGrowth,
            topProducts,
            recentOrders,
            lowStockProducts,
            dailyRevenue: dailyRevenueArray,
        };
        await (0, adminValidation_1.logAdminAction)((_a = request.auth) === null || _a === void 0 ? void 0 : _a.uid, "getDashboardAnalytics", {
            period,
        });
        return {
            success: true,
            data: metrics,
        };
    }
    catch (error) {
        console.error("Error getting dashboard analytics:", error);
        throw new Error("Failed to get dashboard analytics");
    }
});
//# sourceMappingURL=admin-analytics.js.map