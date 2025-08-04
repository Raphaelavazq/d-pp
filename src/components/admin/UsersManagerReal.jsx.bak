import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Users,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Shield,
  Eye,
  Edit3,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Crown,
  User,
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
  deleteDoc,
  where,
} from "firebase/firestore";

const UsersManagerReal = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    newThisMonth: 0,
  });

  const USERS_PER_PAGE = 20;

  useEffect(() => {
    loadUsers();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, statusFilter]);

  useEffect(() => {
    if (searchTerm) {
      searchUsers();
    } else {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const loadUsers = async (loadMore = false) => {
    try {
      if (!loadMore) {
        setLoading(true);
        setUsers([]);
        setLastDoc(null);
        setHasMore(true);
      }

      let q = query(collection(db, "users"), orderBy("createdAt", "desc"));

      // Apply filters
      if (roleFilter) {
        q = query(q, where("role", "==", roleFilter));
      }
      if (statusFilter) {
        q = query(q, where("status", "==", statusFilter));
      }

      // Add pagination
      if (loadMore && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      q = query(q, limit(USERS_PER_PAGE));

      const snapshot = await getDocs(q);
      const newUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Ensure dates are properly formatted
        createdAt:
          doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
        lastLoginAt:
          doc.data().lastLoginAt?.toDate?.() ||
          (doc.data().lastLoginAt ? new Date(doc.data().lastLoginAt) : null),
        updatedAt:
          doc.data().updatedAt?.toDate?.() || new Date(doc.data().updatedAt),
        // Ensure required fields have defaults
        role: doc.data().role || "customer",
        status: doc.data().status || "active",
        isEmailVerified: doc.data().isEmailVerified || false,
        orderCount: doc.data().orderCount || 0,
        totalSpent: doc.data().totalSpent || 0,
      }));

      if (loadMore) {
        setUsers((prev) => [...prev, ...newUsers]);
      } else {
        setUsers(newUsers);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === USERS_PER_PAGE);
    } catch (error) {
      console.error("Error loading users:", error);
      showNotification("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      loadUsers();
      return;
    }

    try {
      setLoading(true);

      // Search by name or email
      const searchTermLower = searchTerm.toLowerCase();

      // Get all users and filter on client side
      let q = query(collection(db, "users"), orderBy("createdAt", "desc"));

      const snapshot = await getDocs(q);
      const searchResults = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt:
            doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
          lastLoginAt:
            doc.data().lastLoginAt?.toDate?.() ||
            new Date(doc.data().lastLoginAt),
          updatedAt:
            doc.data().updatedAt?.toDate?.() || new Date(doc.data().updatedAt),
          role: doc.data().role || "customer",
          status: doc.data().status || "active",
          isEmailVerified: doc.data().isEmailVerified || false,
          orderCount: doc.data().orderCount || 0,
          totalSpent: doc.data().totalSpent || 0,
        }))
        .filter(
          (user) =>
            user.name?.toLowerCase().includes(searchTermLower) ||
            user.email?.toLowerCase().includes(searchTermLower) ||
            user.firstName?.toLowerCase().includes(searchTermLower) ||
            user.lastName?.toLowerCase().includes(searchTermLower)
        );

      setUsers(searchResults);
      setHasMore(false);
    } catch (error) {
      console.error("Error searching users:", error);
      showNotification("Search failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Load user statistics
      const allUsersSnapshot = await getDocs(collection(db, "users"));
      const allUsers = allUsersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt:
          doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
      }));

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const stats = {
        total: allUsers.length,
        active: allUsers.filter((u) => u.status === "active").length,
        inactive: allUsers.filter((u) => u.status === "inactive").length,
        admins: allUsers.filter((u) => u.role === "admin").length,
        newThisMonth: allUsers.filter((u) => u.createdAt >= startOfMonth)
          .length,
      };

      setStats(stats);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        status: newStatus,
        updatedAt: new Date(),
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, status: newStatus, updatedAt: new Date() }
            : user
        )
      );

      showNotification(
        `User ${newStatus === "active" ? "activated" : "deactivated"}`,
        "success"
      );
      loadStats(); // Refresh stats
    } catch (error) {
      console.error("Error updating user status:", error);
      showNotification("Failed to update user status", "error");
    }
  };

  const updateUserRole = async (userId, newRole) => {
    if (
      !confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    ) {
      return;
    }

    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
        updatedAt: new Date(),
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, role: newRole, updatedAt: new Date() }
            : user
        )
      );

      showNotification(`User role updated to ${newRole}`, "success");
      loadStats(); // Refresh stats
    } catch (error) {
      console.error("Error updating user role:", error);
      showNotification("Failed to update user role", "error");
    }
  };

  const deleteUser = async (userId) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      showNotification("User deleted successfully", "success");
      loadStats(); // Refresh stats
    } catch (error) {
      console.error("Error deleting user:", error);
      showNotification("Failed to delete user", "error");
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
    if (!date) return "Never";
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
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "customer":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return Crown;
      case "customer":
        return User;
      default:
        return User;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users</h2>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => loadUsers()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-xl font-bold text-green-600">{stats.active}</p>
            </div>
            <UserCheck className="w-6 h-6 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-xl font-bold text-red-600">{stats.inactive}</p>
            </div>
            <UserX className="w-6 h-6 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-xl font-bold text-purple-600">
                {stats.admins}
              </p>
            </div>
            <Crown className="w-6 h-6 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New This Month</p>
              <p className="text-xl font-bold text-blue-600">
                {stats.newThisMonth}
              </p>
            </div>
            <Calendar className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("");
              setStatusFilter("");
              loadUsers();
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Users will appear here when they register for accounts.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => {
                    const RoleIcon = getRoleIcon(user.role);
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.name ||
                                  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                                  "Unnamed User"}
                              </p>
                              <div className="flex items-center space-x-2">
                                <p className="text-sm text-gray-500">
                                  {user.email}
                                </p>
                                {user.isEmailVerified && (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <select
                              value={user.role}
                              onChange={(e) =>
                                updateUserRole(user.id, e.target.value)
                              }
                              className={`text-xs font-medium rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-blue-500 ${getRoleColor(user.role)}`}
                            >
                              <option value="customer">Customer</option>
                              <option value="admin">Admin</option>
                            </select>
                            <RoleIcon className="w-4 h-4 text-gray-400" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              updateUserStatus(
                                user.id,
                                user.status === "active" ? "inactive" : "active"
                              )
                            }
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${getStatusColor(user.status)}`}
                          >
                            {user.status}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {user.orderCount || 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatPrice(user.totalSpent)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(user.lastLoginAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
                  onClick={() => loadUsers(true)}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Load More Users
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedUser.name ||
                      `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim() ||
                      "Unnamed User"}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    User Information
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p>
                      <span className="font-medium">ID:</span> {selectedUser.id}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedUser.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedUser.phone || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Role:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}
                      >
                        {selectedUser.role}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}
                      >
                        {selectedUser.status}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Email Verified:</span>
                      {selectedUser.isEmailVerified ? (
                        <span className="ml-2 text-green-600">✓ Verified</span>
                      ) : (
                        <span className="ml-2 text-red-600">
                          ✗ Not verified
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Account Activity */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Account Activity
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p>
                      <span className="font-medium">Total Orders:</span>{" "}
                      {selectedUser.orderCount || 0}
                    </p>
                    <p>
                      <span className="font-medium">Total Spent:</span>{" "}
                      {formatPrice(selectedUser.totalSpent)}
                    </p>
                    <p>
                      <span className="font-medium">Created:</span>{" "}
                      {formatDate(selectedUser.createdAt)}
                    </p>
                    <p>
                      <span className="font-medium">Last Login:</span>{" "}
                      {formatDate(selectedUser.lastLoginAt)}
                    </p>
                    <p>
                      <span className="font-medium">Last Updated:</span>{" "}
                      {formatDate(selectedUser.updatedAt)}
                    </p>
                  </div>
                </div>

                {/* Address Information */}
                {selectedUser.address && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Address</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p>{selectedUser.address.street}</p>
                      <p>
                        {selectedUser.address.city},{" "}
                        {selectedUser.address.state}{" "}
                        {selectedUser.address.zipCode}
                      </p>
                      <p>{selectedUser.address.country}</p>
                    </div>
                  </div>
                )}

                {/* Preferences */}
                {selectedUser.preferences && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Preferences
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p>
                        <span className="font-medium">Newsletter:</span>{" "}
                        {selectedUser.preferences.newsletter
                          ? "Subscribed"
                          : "Not subscribed"}
                      </p>
                      <p>
                        <span className="font-medium">Marketing Emails:</span>{" "}
                        {selectedUser.preferences.marketingEmails
                          ? "Enabled"
                          : "Disabled"}
                      </p>
                      <p>
                        <span className="font-medium">Language:</span>{" "}
                        {selectedUser.preferences.language || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Currency:</span>{" "}
                        {selectedUser.preferences.currency || "EUR"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagerReal;
