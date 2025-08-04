import { useState, useEffect } from "react";
import { httpsCallable } from "firebase/functions";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { functions, db } from "../config/firebase";

export const useDashboardAnalytics = (period = "30d") => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFallbackData = async () => {
    console.log("Fetching fallback dashboard data...");

    try {
      // Get orders count and revenue from Firestore directly
      const ordersQuery = query(collection(db, "orders"));
      const ordersSnapshot = await getDocs(ordersQuery);

      let totalRevenue = 0;
      let totalOrders = 0;

      ordersSnapshot.docs.forEach((doc) => {
        const order = doc.data();
        if (order.status !== "cancelled") {
          totalRevenue += order.total || 0;
          totalOrders += 1;
        }
      });

      // Get users count
      const usersQuery = query(
        collection(db, "users"),
        where("role", "==", "customer")
      );
      const usersSnapshot = await getDocs(usersQuery);
      const totalCustomers = usersSnapshot.size;

      // Get products count
      const productsQuery = query(
        collection(db, "products"),
        where("status", "==", "active")
      );
      const productsSnapshot = await getDocs(productsQuery);
      const totalProducts = productsSnapshot.size;

      return {
        summary: {
          totalRevenue,
          totalOrders,
          totalCustomers,
          newCustomers: Math.floor(totalCustomers * 0.1), // Estimate
          totalProducts,
          lowStockProducts: 0,
          averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        },
      };
    } catch (err) {
      console.error("Error fetching fallback data:", err);
      // Return empty data structure
      return {
        summary: {
          totalRevenue: 0,
          totalOrders: 0,
          totalCustomers: 0,
          newCustomers: 0,
          totalProducts: 0,
          lowStockProducts: 0,
          averageOrderValue: 0,
        },
      };
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // First try to get analytics data from Firebase Functions
        let analyticsResult = null;

        try {
          const getDashboardAnalyticsFn = httpsCallable(
            functions,
            "getDashboardAnalytics"
          );
          const result = await getDashboardAnalyticsFn({ period });
          analyticsResult = result.data;
          console.log("Successfully fetched analytics from Functions");
        } catch (functionError) {
          console.warn(
            "Firebase Functions analytics failed, falling back to direct Firestore:",
            functionError
          );
          analyticsResult = await fetchFallbackData();
        }

        setAnalyticsData(analyticsResult);

        // Get recent orders
        try {
          const ordersQuery = query(
            collection(db, "orders"),
            orderBy("createdAt", "desc"),
            limit(5)
          );
          const ordersSnapshot = await getDocs(ordersQuery);
          const ordersData = ordersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date(),
          }));
          setRecentOrders(ordersData);
        } catch (ordersError) {
          console.warn("Error fetching recent orders:", ordersError);
          setRecentOrders([]);
        }

        // Get low stock products
        try {
          const lowStockQuery = query(
            collection(db, "inventory"),
            where("quantity", "<=", 10),
            orderBy("quantity", "asc"),
            limit(5)
          );
          const lowStockSnapshot = await getDocs(lowStockQuery);
          const lowStockData = [];

          for (const doc of lowStockSnapshot.docs) {
            const inventoryData = doc.data();
            try {
              // Get product details
              const productQuery = query(
                collection(db, "products"),
                where("id", "==", inventoryData.productId),
                limit(1)
              );
              const productSnapshot = await getDocs(productQuery);

              if (!productSnapshot.empty) {
                const productData = productSnapshot.docs[0].data();
                lowStockData.push({
                  id: inventoryData.productId,
                  name:
                    productData.title || productData.name || "Unknown Product",
                  category: productData.category || "Uncategorized",
                  stock: inventoryData.quantity || 0,
                  status:
                    inventoryData.quantity === 0 ? "out_of_stock" : "low_stock",
                });
              }
            } catch (productError) {
              console.warn(
                "Error fetching product for inventory item:",
                productError
              );
            }
          }
          setLowStockProducts(lowStockData);
        } catch (inventoryError) {
          console.warn("Error fetching low stock products:", inventoryError);
          setLowStockProducts([]);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err);

        // Set fallback data even on error
        const fallbackData = await fetchFallbackData();
        setAnalyticsData(fallbackData);
        setRecentOrders([]);
        setLowStockProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [period]);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      // Re-fetch all data
      let analyticsResult = null;

      try {
        const getDashboardAnalyticsFn = httpsCallable(
          functions,
          "getDashboardAnalytics"
        );
        const result = await getDashboardAnalyticsFn({ period });
        analyticsResult = result.data;
      } catch (functionError) {
        console.warn(
          "Firebase Functions analytics failed on refetch, falling back:",
          functionError
        );
        analyticsResult = await fetchFallbackData();
      }

      setAnalyticsData(analyticsResult);

      // Refetch recent orders
      try {
        const ordersQuery = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersData = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        }));
        setRecentOrders(ordersData);
      } catch (ordersError) {
        console.warn("Error refetching recent orders:", ordersError);
      }

      // Refetch low stock products
      try {
        const lowStockQuery = query(
          collection(db, "inventory"),
          where("quantity", "<=", 10),
          orderBy("quantity", "asc"),
          limit(5)
        );
        const lowStockSnapshot = await getDocs(lowStockQuery);
        const lowStockData = [];

        for (const doc of lowStockSnapshot.docs) {
          const inventoryData = doc.data();
          try {
            const productQuery = query(
              collection(db, "products"),
              where("id", "==", inventoryData.productId),
              limit(1)
            );
            const productSnapshot = await getDocs(productQuery);

            if (!productSnapshot.empty) {
              const productData = productSnapshot.docs[0].data();
              lowStockData.push({
                id: inventoryData.productId,
                name:
                  productData.title || productData.name || "Unknown Product",
                category: productData.category || "Uncategorized",
                stock: inventoryData.quantity || 0,
                status:
                  inventoryData.quantity === 0 ? "out_of_stock" : "low_stock",
              });
            }
          } catch (productError) {
            console.warn(
              "Error refetching product for inventory item:",
              productError
            );
          }
        }
        setLowStockProducts(lowStockData);
      } catch (inventoryError) {
        console.warn("Error refetching low stock products:", inventoryError);
      }

      setError(null);
    } catch (err) {
      console.error("Error refetching dashboard data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    analyticsData,
    recentOrders,
    lowStockProducts,
    loading,
    error,
    refetch,
  };
};
