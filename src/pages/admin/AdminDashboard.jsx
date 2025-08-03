import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import DashboardOverview from "../../components/admin/DashboardOverview";
import ProductsManagerReal from "../../components/admin/ProductsManagerReal";
import OrdersManagerReal from "../../components/admin/OrdersManagerReal";
import UsersManagerReal from "../../components/admin/UsersManagerReal";
import BigBuyImporter from "../../components/admin/BigBuyImporter";
import SEOManager from "../../components/admin/SEOManager";
import PagesManager from "../../components/admin/PagesManager";
import InventoryManager from "../../components/admin/InventoryManager";
import AnalyticsManager from "../../components/admin/AnalyticsManager";
import SettingsManager from "../../components/admin/SettingsManager";

const AdminDashboard = () => {
  const { currentUser, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!currentUser || userProfile?.role !== "admin")) {
      navigate("/admin/login");
    }
  }, [currentUser, userProfile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || userProfile?.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route index element={<DashboardOverview />} />
              <Route path="overview" element={<DashboardOverview />} />
              <Route path="products" element={<ProductsManagerReal />} />
              <Route path="orders" element={<OrdersManagerReal />} />
              <Route path="users" element={<UsersManagerReal />} />
              <Route path="inventory" element={<InventoryManager />} />
              <Route path="bigbuy-importer" element={<BigBuyImporter />} />
              <Route path="seo" element={<SEOManager />} />
              <Route path="pages" element={<PagesManager />} />
              <Route path="analytics" element={<AnalyticsManager />} />
              <Route path="settings" element={<SettingsManager />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
