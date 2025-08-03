import React from "react";
import { BarChart3, TrendingUp, PieChart } from "lucide-react";

const AnalyticsManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Track performance metrics and business insights
          </p>
        </div>
        <button className="mt-4 sm:mt-0 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
          <TrendingUp className="w-4 h-4 mr-2 inline" />
          Generate Report
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Analytics Dashboard
        </h3>
        <p className="mt-2 text-gray-600">
          Comprehensive analytics and reporting will be implemented here. This
          will include sales metrics, customer insights, and performance
          tracking.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Sales Analytics</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Performance Metrics</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <PieChart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Customer Insights</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManager;
