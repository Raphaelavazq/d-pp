import React, { createContext } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../config/firebase";
import { useAuth } from "../hooks/useAuth";

const FirestoreContext = createContext({});

export const FirestoreProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Products
  const getProducts = async (filters = {}) => {
    try {
      let q = collection(db, "products");

      if (filters.category) {
        q = query(q, where("category", "==", filters.category));
      }

      if (filters.featured !== undefined) {
        q = query(q, where("featured", "==", filters.featured));
      }

      q = query(q, orderBy("createdAt", "desc"));

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting products:", error);
      throw error;
    }
  };

  const getProduct = async (productId) => {
    try {
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      console.error("Error getting product:", error);
      throw error;
    }
  };

  // Orders
  const createOrder = async (orderData) => {
    try {
      const createOrderFn = httpsCallable(functions, "createOrder");
      const result = await createOrderFn(orderData);
      return result.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const getUserOrders = async (userId = currentUser?.uid) => {
    if (!userId) throw new Error("No user ID provided");

    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting user orders:", error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId, status, trackingNumber = null) => {
    try {
      const updateOrderFn = httpsCallable(functions, "updateOrderStatus");
      const result = await updateOrderFn({ orderId, status, trackingNumber });
      return result.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  };

  // Inventory
  const getInventory = async (productId) => {
    try {
      const docRef = doc(db, "inventory", productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting inventory:", error);
      throw error;
    }
  };

  const subscribeToInventory = (productId, callback) => {
    const docRef = doc(db, "inventory", productId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
  };

  // Notifications
  const getUserNotifications = async (limit = 50) => {
    if (!currentUser) throw new Error("No user logged in");

    try {
      const getUserNotificationsFn = httpsCallable(
        functions,
        "getUserNotifications"
      );
      const result = await getUserNotificationsFn({ limit });
      return result.data.notifications;
    } catch (error) {
      console.error("Error getting notifications:", error);
      throw error;
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      const markNotificationReadFn = httpsCallable(
        functions,
        "markNotificationRead"
      );
      const result = await markNotificationReadFn({ notificationId });
      return result.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  };

  // Analytics (Admin only)
  const getDashboardAnalytics = async (period = "30d") => {
    try {
      const getDashboardAnalyticsFn = httpsCallable(
        functions,
        "getDashboardAnalytics"
      );
      const result = await getDashboardAnalyticsFn({ period });
      return result.data;
    } catch (error) {
      console.error("Error getting dashboard analytics:", error);
      throw error;
    }
  };

  // Product sync (Admin/Supplier only)
  const syncProductsFromAliExpress = async (supplierId, apiKey, category) => {
    try {
      const syncProductsFn = httpsCallable(
        functions,
        "syncProductsFromAliExpress"
      );
      const result = await syncProductsFn({ supplierId, apiKey, category });
      return result.data;
    } catch (error) {
      console.error("Error syncing products:", error);
      throw error;
    }
  };

  // Suppliers
  const getSuppliers = async () => {
    try {
      const q = query(
        collection(db, "suppliers"),
        where("status", "==", "active"),
        orderBy("name", "asc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting suppliers:", error);
      throw error;
    }
  };

  const addSupplier = async (supplierData) => {
    try {
      const docRef = await addDoc(collection(db, "suppliers"), {
        ...supplierData,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding supplier:", error);
      throw error;
    }
  };

  const updateSupplier = async (supplierId, supplierData) => {
    try {
      const docRef = doc(db, "suppliers", supplierId);
      await updateDoc(docRef, {
        ...supplierData,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating supplier:", error);
      throw error;
    }
  };

  const deleteSupplier = async (supplierId) => {
    try {
      const docRef = doc(db, "suppliers", supplierId);
      await updateDoc(docRef, {
        status: "inactive",
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error deleting supplier:", error);
      throw error;
    }
  };

  // Real-time subscriptions
  const subscribeToProducts = (callback, filters = {}) => {
    let q = collection(db, "products");

    if (filters.category) {
      q = query(q, where("category", "==", filters.category));
    }

    q = query(q, orderBy("createdAt", "desc"));

    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(products);
    });
  };

  const subscribeToUserOrders = (callback, userId = currentUser?.uid) => {
    if (!userId) return () => {};

    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(orders);
    });
  };

  const value = {
    // Products
    getProducts,
    getProduct,
    subscribeToProducts,

    // Orders
    createOrder,
    getUserOrders,
    updateOrderStatus,
    subscribeToUserOrders,

    // Inventory
    getInventory,
    subscribeToInventory,

    // Notifications
    getUserNotifications,
    markNotificationRead,

    // Analytics
    getDashboardAnalytics,

    // Product sync
    syncProductsFromAliExpress,

    // Suppliers
    getSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
  };

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
};

export default FirestoreContext;
