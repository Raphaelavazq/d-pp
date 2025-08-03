import React from "react";
import { Users, UserPlus, Shield, Ban } from "lucide-react";

const UsersManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-1">
            Manage customer accounts and permissions
          </p>
        </div>
        <button className="mt-4 sm:mt-0 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
          <UserPlus className="w-4 h-4 mr-2 inline" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Users Management
        </h3>
        <p className="mt-2 text-gray-600">
          User management functionality will be implemented here. This will
          include user roles, permissions, and account management.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Role Management</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium">User Accounts</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <Ban className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Access Control</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManager;
