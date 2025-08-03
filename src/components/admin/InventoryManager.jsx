import React from "react";
import { Warehouse, AlertTriangle, RefreshCw } from "lucide-react";

const InventoryManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inventory Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track stock levels and manage BigBuy inventory sync
          </p>
        </div>
        <button className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          <RefreshCw className="w-4 h-4 mr-2 inline" />
          Sync BigBuy Stock
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Warehouse className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Inventory Management
        </h3>
        <p className="mt-2 text-gray-600">
          Inventory management with BigBuy integration will be implemented here.
          This will include stock tracking, automatic updates, and low stock
          alerts.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <Warehouse className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Stock Tracking</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <RefreshCw className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium">BigBuy Sync</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Low Stock Alerts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;
