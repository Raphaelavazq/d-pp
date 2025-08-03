import React from "react";
import { Settings, Database, Mail, Globe } from "lucide-react";

const SettingsManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure system settings and preferences
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Settings className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          System Settings
        </h3>
        <p className="mt-2 text-gray-600">
          System configuration and settings will be implemented here. This will
          include general settings, integrations, and system preferences.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium">General Settings</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <Database className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Integrations</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <Mail className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Notifications</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
