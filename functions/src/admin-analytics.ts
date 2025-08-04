import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { validateAdminAccess, logAdminAction } from "./utils/adminValidation";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  activeProducts: number;
  averageOrderValue: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
  topProducts: { id: string; name: string; sales: number; revenue: number }[];
  recentOrders: any[];
  lowStockProducts: { id: string; name: string; stock: number }[];
  dailyRevenue: { date: string; revenue: number; orders: number }[];
}

/**
 * Get comprehensive dashboard analytics for admin
 */
export const getDashboardAnalytics = onCall(
  { region: "europe-west1" },
  async (request) => {
    await validateAdminAccess(request.auth);

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
      const productSales: {
        [key: string]: { name: string; sales: number; revenue: number };
      } = {};
      const recentOrders: any[] = [];
      const dailyRevenue: {
        [key: string]: { revenue: number; orders: number };
      } = {};

      ordersSnapshot.forEach((doc) => {
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
            createdAt: order.createdAt?.toDate(),
          });
        }

        // Track daily revenue
        const orderDate = order.createdAt?.toDate().toISOString().split("T")[0];
        if (!dailyRevenue[orderDate]) {
          dailyRevenue[orderDate] = { revenue: 0, orders: 0 };
        }
        dailyRevenue[orderDate].revenue += orderAmount;
        dailyRevenue[orderDate].orders += 1;

        // Track product sales
        if (order.items) {
          order.items.forEach((item: any) => {
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
      const revenueGrowth =
        previousRevenue > 0
          ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
          : 0;
      const orderGrowth =
        previousOrders > 0
          ? ((totalOrders - previousOrders) / previousOrders) * 100
          : 0;

      // Get top products
      const topProducts = Object.entries(productSales)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Get low stock products
      const lowStockProducts: { id: string; name: string; stock: number }[] =
        [];
      productsSnapshot.forEach((doc) => {
        const product = doc.data();
        const stock = product.inventory?.quantity || 0;
        if (stock < (product.inventory?.reorderPoint || 10)) {
          lowStockProducts.push({
            id: doc.id,
            name: product.name,
            stock,
          });
        }
      });

      // Format daily revenue data
      const dailyRevenueArray = Object.entries(dailyRevenue)
        .map(([date, data]) => ({ date, ...data }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      const averageOrderValue =
        totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const customerGrowth = 0; // Would need historical user data for accurate calculation

      const metrics: DashboardMetrics = {
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

      await logAdminAction(request.auth?.uid, "getDashboardAnalytics", {
        period,
      });

      return {
        success: true,
        data: metrics,
      };
    } catch (error) {
      console.error("Error getting dashboard analytics:", error);
      throw new Error("Failed to get dashboard analytics");
    }
  }
);
