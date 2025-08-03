import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Search,
  Globe,
  Settings,
  Home,
  Warehouse,
  X,
  Download,
} from "lucide-react";

const AdminSidebar = ({ open, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    {
      name: "Overview",
      href: "/admin/dashboard",
      icon: Home,
    },
    {
      name: "Products",
      href: "/admin/dashboard/products",
      icon: Package,
    },
    {
      name: "Orders",
      href: "/admin/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      name: "Inventory",
      href: "/admin/dashboard/inventory",
      icon: Warehouse,
    },
    {
      name: "BigBuy Importer",
      href: "/admin/dashboard/bigbuy-importer",
      icon: Download,
    },
    {
      name: "Users",
      href: "/admin/dashboard/users",
      icon: Users,
    },
    {
      name: "Analytics",
      href: "/admin/dashboard/analytics",
      icon: BarChart3,
    },
    {
      name: "SEO",
      href: "/admin/dashboard/seo",
      icon: Search,
    },
    {
      name: "Pages",
      href: "/admin/dashboard/pages",
      icon: FileText,
    },
    {
      name: "Settings",
      href: "/admin/dashboard/settings",
      icon: Settings,
    },
  ];

  const isActive = (href) => {
    if (href === "/admin/dashboard") {
      return (
        location.pathname === href ||
        location.pathname === "/admin/dashboard/overview"
      );
    }
    return location.pathname === href;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">düpp</h1>
                <p className="text-xs text-gray-500 font-medium">
                  Admin Dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex-1 px-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive(item.href)
                      ? "bg-purple-50 text-purple-700 border-r-2 border-purple-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`mr-3 w-5 h-5 ${
                      isActive(item.href)
                        ? "text-purple-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-30 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-bold text-gray-900">düpp</h1>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive(item.href)
                      ? "bg-purple-50 text-purple-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`mr-3 w-5 h-5 ${
                      isActive(item.href)
                        ? "text-purple-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
