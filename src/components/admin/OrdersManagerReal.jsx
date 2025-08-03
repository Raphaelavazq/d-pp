import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  Calendar,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { db } from "../../config/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  updateDoc,
  where,
} from "firebase/firestore";

const OrdersManagerReal = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    totalRevenue: 0,
  });

  const ORDERS_PER_PAGE = 20;

  useEffect(() => {
    loadOrders();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    if (searchTerm) {
      searchOrders();
    } else {
      loadOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const loadOrders = async (loadMore = false) => {
    try {
      if (!loadMore) {
        setLoading(true);
        setOrders([]);
        setLastDoc(null);
        setHasMore(true);
      }

      let q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

      // Apply status filter
      if (statusFilter) {
        q = query(q, where("status", "==", statusFilter));
      }

      // Add pagination
      if (loadMore && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      q = query(q, limit(ORDERS_PER_PAGE));

      const snapshot = await getDocs(q);
      const newOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Ensure dates are properly formatted
        createdAt:
          doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
        updatedAt:
          doc.data().updatedAt?.toDate?.() || new Date(doc.data().updatedAt),
      }));

      if (loadMore) {
        setOrders((prev) => [...prev, ...newOrders]);
      } else {
        setOrders(newOrders);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === ORDERS_PER_PAGE);
    } catch (error) {
      console.error("Error loading orders:", error);
      showNotification("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const searchOrders = async () => {
    if (!searchTerm.trim()) {
      loadOrders();
      return;
    }

    try {
      setLoading(true);

      // Search by order ID, customer name, or email
      const searchTermLower = searchTerm.toLowerCase();

      // Get all orders and filter on client side
      let q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

      const snapshot = await getDocs(q);
      const searchResults = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt:
            doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
          updatedAt:
            doc.data().updatedAt?.toDate?.() || new Date(doc.data().updatedAt),
        }))
        .filter(
          (order) =>
            order.id?.toLowerCase().includes(searchTermLower) ||
            order.customerName?.toLowerCase().includes(searchTermLower) ||
            order.customerEmail?.toLowerCase().includes(searchTermLower) ||
            order.orderNumber?.toLowerCase().includes(searchTermLower)
        );

      setOrders(searchResults);
      setHasMore(false);
    } catch (error) {
      console.error("Error searching orders:", error);
      showNotification("Search failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Load order statistics
      const allOrdersSnapshot = await getDocs(collection(db, "orders"));
      const allOrders = allOrdersSnapshot.docs.map((doc) => doc.data());

      const stats = {
        total: allOrders.length,
        pending: allOrders.filter((o) => o.status === "pending").length,
        processing: allOrders.filter((o) => o.status === "processing").length,
        shipped: allOrders.filter((o) => o.status === "shipped").length,
        delivered: allOrders.filter((o) => o.status === "delivered").length,
        totalRevenue: allOrders.reduce(
          (sum, order) => sum + (order.total || 0),
          0
        ),
      };

      setStats(stats);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: new Date(),
        // Add status-specific fields
        ...(newStatus === "shipped" && { shippedAt: new Date() }),
        ...(newStatus === "delivered" && { deliveredAt: new Date() }),
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                updatedAt: new Date(),
                ...(newStatus === "shipped" && { shippedAt: new Date() }),
                ...(newStatus === "delivered" && { deliveredAt: new Date() }),
              }
            : order
        )
      );

      showNotification(`Order status updated to ${newStatus}`, "success");
      loadStats(); // Refresh stats
    } catch (error) {
      console.error("Error updating order status:", error);
      showNotification("Failed to update order status", "error");
    }
  };

  const addTrackingNumber = async (orderId, trackingNumber) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        trackingNumber,
        updatedAt: new Date(),
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, trackingNumber, updatedAt: new Date() }
            : order
        )
      );

      showNotification("Tracking number added successfully", "success");
    } catch (error) {
      console.error("Error adding tracking number:", error);
      showNotification("Failed to add tracking number", "error");
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(price || 0);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return Clock;
      case "processing":
        return Package;
      case "shipped":
        return Truck;
      case "delivered":
        return CheckCircle;
      case "cancelled":
        return X;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-600">
            Manage customer orders and fulfillment
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => loadOrders()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              // Export orders functionality
              const csvData = orders.map((order) => ({
                "Order ID": order.id,
                Customer: order.customerName,
                Email: order.customerEmail,
                Status: order.status,
                Total: order.total,
                Date: formatDate(order.createdAt),
              }));

              const csv = [
                Object.keys(csvData[0]).join(","),
                ...csvData.map((row) => Object.values(row).join(",")),
              ].join("\\n");

              const blob = new Blob([csv], { type: "text/csv" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
              a.click();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`p-4 rounded-lg flex items-center space-x-2 ${
            notification.type === "success"
              ? "bg-green-50 text-green-800"
              : notification.type === "error"
                ? "bg-red-50 text-red-800"
                : notification.type === "warning"
                  ? "bg-yellow-50 text-yellow-800"
                  : "bg-blue-50 text-blue-800"
          }`}
        >
          {notification.type === "success" && (
            <CheckCircle className="w-5 h-5" />
          )}
          {notification.type === "error" && <AlertCircle className="w-5 h-5" />}
          {notification.type === "warning" && (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Package className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <Clock className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-xl font-bold text-blue-600">
                {stats.processing}
              </p>
            </div>
            <Package className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shipped</p>
              <p className="text-xl font-bold text-purple-600">
                {stats.shipped}
              </p>
            </div>
            <Truck className="w-6 h-6 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-xl font-bold text-green-600">
                {stats.delivered}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-xl font-bold text-green-600">
                {formatPrice(stats.totalRevenue)}
              </p>
            </div>
            <DollarSign className="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              loadOrders();
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Orders will appear here when customers make purchases.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.orderNumber || order.id}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.items?.length || 0} item(s)
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.customerName || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.customerEmail || "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                updateOrderStatus(order.id, e.target.value)
                              }
                              className={`text-xs font-medium rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(order.status)}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <StatusIcon className="w-4 h-4 text-gray-400" />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {formatPrice(order.total)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Load More */}
            {hasMore && !loading && (
              <div className="p-4 text-center border-t">
                <button
                  onClick={() => loadOrders(true)}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Load More Orders
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order {selectedOrder.orderNumber || selectedOrder.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Customer Information
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedOrder.customerName || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedOrder.customerEmail || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedOrder.customerPhone || "N/A"}
                    </p>
                  </div>

                  {/* Shipping Address */}
                  {selectedOrder.shippingAddress && (
                    <>
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Shipping Address
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p>{selectedOrder.shippingAddress.street}</p>
                        <p>
                          {selectedOrder.shippingAddress.city},{" "}
                          {selectedOrder.shippingAddress.state}{" "}
                          {selectedOrder.shippingAddress.zipCode}
                        </p>
                        <p>{selectedOrder.shippingAddress.country}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Order Details */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Order Details
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p>
                      <span className="font-medium">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}
                      >
                        {selectedOrder.status}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Total:</span>{" "}
                      {formatPrice(selectedOrder.total)}
                    </p>
                    <p>
                      <span className="font-medium">Shipping Method:</span>{" "}
                      {selectedOrder.shippingMethod || "N/A"}
                    </p>
                    {selectedOrder.trackingNumber && (
                      <p>
                        <span className="font-medium">Tracking:</span>{" "}
                        {selectedOrder.trackingNumber}
                      </p>
                    )}
                    {selectedOrder.notes && (
                      <p>
                        <span className="font-medium">Notes:</span>{" "}
                        {selectedOrder.notes}
                      </p>
                    )}
                  </div>

                  {/* Add Tracking Number */}
                  {selectedOrder.status === "shipped" &&
                    !selectedOrder.trackingNumber && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Add Tracking Number
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Enter tracking number"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && e.target.value.trim()) {
                                addTrackingNumber(
                                  selectedOrder.id,
                                  e.target.value.trim()
                                );
                                setSelectedOrder(null);
                              }
                            }}
                          />
                          <button
                            onClick={(e) => {
                              const input = e.target.previousElementSibling;
                              if (input.value.trim()) {
                                addTrackingNumber(
                                  selectedOrder.id,
                                  input.value.trim()
                                );
                                setSelectedOrder(null);
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                          Product
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                          Quantity
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                          Price
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">
                            <div className="flex items-center space-x-3">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 rounded object-cover"
                                />
                              )}
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2">{item.quantity}</td>
                          <td className="px-4 py-2">
                            {formatPrice(item.price)}
                          </td>
                          <td className="px-4 py-2">
                            {formatPrice(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagerReal;
