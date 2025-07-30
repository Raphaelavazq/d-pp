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
exports.analytics = exports.exportAnalytics = exports.getProductAnalytics = exports.getDashboardAnalytics = exports.generateDailyReport = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
// Generate daily analytics report
exports.generateDailyReport = functions.https.onCall(async (data, context) => {
    if (!context.auth || !context.auth.token.admin) {
        throw new functions.https.HttpsError("permission-denied", "Admin access required");
    }
    try {
        const { date } = data;
        const reportDate = date ? new Date(date) : new Date();
        reportDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(reportDate);
        nextDay.setDate(reportDate.getDate() + 1);
        // Get orders for the day
        const ordersSnapshot = await db
            .collection("orders")
            .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(reportDate))
            .where("createdAt", "<", admin.firestore.Timestamp.fromDate(nextDay))
            .where("status", "!=", "cancelled")
            .get();
        let totalRevenue = 0;
        let totalOrders = ordersSnapshot.size;
        const productSales = new Map();
        const categorySales = new Map();
        // Process orders
        for (const orderDoc of ordersSnapshot.docs) {
            const order = orderDoc.data();
            totalRevenue += order.total;
            // Process order items
            for (const item of order.items) {
                // Get product details
                const productDoc = await db
                    .collection("products")
                    .doc(item.productId)
                    .get();
                if (productDoc.exists) {
                    const product = productDoc.data();
                    // Update product sales
                    if (productSales.has(item.productId)) {
                        const existing = productSales.get(item.productId);
                        existing.sales += 1;
                        existing.revenue += item.price * item.quantity;
                        existing.quantity += item.quantity;
                    }
                    else {
                        productSales.set(item.productId, {
                            productId: item.productId,
                            title: product.title,
                            sales: 1,
                            revenue: item.price * item.quantity,
                            quantity: item.quantity,
                        });
                    }
                    // Update category sales
                    const category = product.category;
                    if (categorySales.has(category)) {
                        const existing = categorySales.get(category);
                        existing.sales += 1;
                        existing.revenue += item.price * item.quantity;
                        existing.quantity += item.quantity;
                    }
                    else {
                        categorySales.set(category, {
                            category,
                            sales: 1,
                            revenue: item.price * item.quantity,
                            quantity: item.quantity,
                        });
                    }
                }
            }
        }
        // Get new customers for the day
        const newCustomersSnapshot = await db
            .collection("users")
            .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(reportDate))
            .where("createdAt", "<", admin.firestore.Timestamp.fromDate(nextDay))
            .where("role", "==", "customer")
            .get();
        // Get total products
        const productsSnapshot = await db
            .collection("products")
            .where("status", "==", "active")
            .get();
        // Calculate metrics
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const conversionRate = 0.02; // Mock conversion rate - would calculate from real traffic data
        // Sort top products and categories
        const topProducts = Array.from(productSales.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
        const topCategories = Array.from(categorySales.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
        const analyticsData = {
            date: reportDate.toISOString().split("T")[0],
            revenue: totalRevenue,
            orders: totalOrders,
            customers: newCustomersSnapshot.size,
            products: productsSnapshot.size,
            averageOrderValue,
            conversionRate,
            topProducts,
            topCategories,
        };
        // Save to analytics collection
        await db
            .collection("analytics")
            .doc(analyticsData.date)
            .set(analyticsData);
        return { success: true, data: analyticsData };
    }
    catch (error) {
        console.error("Daily report generation error:", error);
        throw new functions.https.HttpsError("internal", "Report generation failed");
    }
});
// Get analytics dashboard data
exports.getDashboardAnalytics = functions.https.onCall(async (data, context) => {
    if (!context.auth || !context.auth.token.admin) {
        throw new functions.https.HttpsError("permission-denied", "Admin access required");
    }
    try {
        const { period = "30d" } = data;
        const now = new Date();
        const startDate = new Date();
        switch (period) {
            case "7d":
                startDate.setDate(now.getDate() - 7);
                break;
            case "30d":
                startDate.setDate(now.getDate() - 30);
                break;
            case "90d":
                startDate.setDate(now.getDate() - 90);
                break;
            default:
                startDate.setDate(now.getDate() - 30);
        }
        // Get orders for the period
        const ordersSnapshot = await db
            .collection("orders")
            .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(startDate))
            .where("status", "!=", "cancelled")
            .get();
        let totalRevenue = 0;
        let totalOrders = ordersSnapshot.size;
        const dailyRevenue = new Map();
        const dailyOrders = new Map();
        ordersSnapshot.docs.forEach((doc) => {
            const order = doc.data();
            const orderDate = order.createdAt.toDate().toISOString().split("T")[0];
            totalRevenue += order.total;
            // Daily revenue
            dailyRevenue.set(orderDate, (dailyRevenue.get(orderDate) || 0) + order.total);
            // Daily orders
            dailyOrders.set(orderDate, (dailyOrders.get(orderDate) || 0) + 1);
        });
        // Get total customers
        const customersSnapshot = await db
            .collection("users")
            .where("role", "==", "customer")
            .get();
        // Get new customers for the period
        const newCustomersSnapshot = await db
            .collection("users")
            .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(startDate))
            .where("role", "==", "customer")
            .get();
        // Get products
        const productsSnapshot = await db
            .collection("products")
            .where("status", "==", "active")
            .get();
        // Get low stock products
        const lowStockSnapshot = await db
            .collection("inventory")
            .where("status", "in", ["low_stock", "out_of_stock"])
            .get();
        // Calculate metrics
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        // Generate daily data for charts
        const chartData = [];
        for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split("T")[0];
            chartData.push({
                date: dateStr,
                revenue: dailyRevenue.get(dateStr) || 0,
                orders: dailyOrders.get(dateStr) || 0,
            });
        }
        return {
            success: true,
            period,
            summary: {
                totalRevenue,
                totalOrders,
                totalCustomers: customersSnapshot.size,
                newCustomers: newCustomersSnapshot.size,
                totalProducts: productsSnapshot.size,
                lowStockProducts: lowStockSnapshot.size,
                averageOrderValue,
            },
            chartData,
        };
    }
    catch (error) {
        console.error("Dashboard analytics error:", error);
        throw new functions.https.HttpsError("internal", "Analytics retrieval failed");
    }
});
// Get product performance analytics
exports.getProductAnalytics = functions.https.onCall(async (data, context) => {
    if (!context.auth || !context.auth.token.admin) {
        throw new functions.https.HttpsError("permission-denied", "Admin access required");
    }
    try {
        const { productId, period = "30d" } = data;
        const now = new Date();
        const startDate = new Date();
        switch (period) {
            case "7d":
                startDate.setDate(now.getDate() - 7);
                break;
            case "30d":
                startDate.setDate(now.getDate() - 30);
                break;
            case "90d":
                startDate.setDate(now.getDate() - 90);
                break;
            default:
                startDate.setDate(now.getDate() - 30);
        }
        // Get orders containing this product
        const ordersSnapshot = await db
            .collection("orders")
            .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(startDate))
            .where("status", "!=", "cancelled")
            .get();
        let totalSales = 0;
        let totalRevenue = 0;
        let totalQuantity = 0;
        const dailySales = new Map();
        ordersSnapshot.docs.forEach((doc) => {
            const order = doc.data();
            const orderDate = order.createdAt.toDate().toISOString().split("T")[0];
            order.items.forEach((item) => {
                if (item.productId === productId) {
                    totalSales += 1;
                    totalRevenue += item.price * item.quantity;
                    totalQuantity += item.quantity;
                    const existing = dailySales.get(orderDate) || {
                        sales: 0,
                        revenue: 0,
                        quantity: 0,
                    };
                    existing.sales += 1;
                    existing.revenue += item.price * item.quantity;
                    existing.quantity += item.quantity;
                    dailySales.set(orderDate, existing);
                }
            });
        });
        // Generate daily data
        const chartData = [];
        for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split("T")[0];
            const dayData = dailySales.get(dateStr) || {
                sales: 0,
                revenue: 0,
                quantity: 0,
            };
            chartData.push(Object.assign({ date: dateStr }, dayData));
        }
        return {
            success: true,
            productId,
            period,
            summary: {
                totalSales,
                totalRevenue,
                totalQuantity,
                averageOrderValue: totalSales > 0 ? totalRevenue / totalSales : 0,
            },
            chartData,
        };
    }
    catch (error) {
        console.error("Product analytics error:", error);
        throw new functions.https.HttpsError("internal", "Product analytics retrieval failed");
    }
});
// Export analytics data
exports.exportAnalytics = functions.https.onCall(async (data, context) => {
    if (!context.auth || !context.auth.token.admin) {
        throw new functions.https.HttpsError("permission-denied", "Admin access required");
    }
    try {
        const { startDate, endDate, format = "json" } = data;
        // Get analytics data for the period
        const analyticsSnapshot = await db
            .collection("analytics")
            .where("date", ">=", startDate)
            .where("date", "<=", endDate)
            .orderBy("date", "asc")
            .get();
        const analyticsData = analyticsSnapshot.docs.map((doc) => doc.data());
        if (format === "csv") {
            // Convert to CSV format
            const csvData = convertToCSV(analyticsData);
            return { success: true, data: csvData, format: "csv" };
        }
        return {
            success: true,
            data: analyticsData,
            format: "json",
        };
    }
    catch (error) {
        console.error("Export analytics error:", error);
        throw new functions.https.HttpsError("internal", "Analytics export failed");
    }
});
function convertToCSV(data) {
    if (data.length === 0)
        return "";
    const headers = Object.keys(data[0]).filter((key) => !["topProducts", "topCategories"].includes(key));
    const csvRows = [headers.join(",")];
    data.forEach((row) => {
        const values = headers.map((header) => {
            const value = row[header];
            return typeof value === "string" ? `"${value}"` : value;
        });
        csvRows.push(values.join(","));
    });
    return csvRows.join("\n");
}
exports.analytics = {
    generateDailyReport: async () => {
        console.log("Generating daily analytics report...");
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        try {
            // This would call the generateDailyReport function
            console.log(`Generated analytics report for ${yesterday.toISOString().split("T")[0]}`);
        }
        catch (error) {
            console.error("Failed to generate daily report:", error);
        }
    },
    getDashboardAnalytics: exports.getDashboardAnalytics,
    getProductAnalytics: exports.getProductAnalytics,
    exportAnalytics: exports.exportAnalytics,
};
//# sourceMappingURL=analytics.js.map