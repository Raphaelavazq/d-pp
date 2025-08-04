import React from "react";
import { useBigBuyStock } from "../hooks/useBigBuyStock";

const StockStatus = ({ productId, className = "" }) => {
  const { inStock, availableQuantity, isLoading, error } =
    useBigBuyStock(productId);

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-500">Checking stock...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
        <span className="text-sm text-yellow-700">
          Stock status unavailable
        </span>
      </div>
    );
  }

  if (!inStock) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-sm text-red-700 font-medium">Out of Stock</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-sm text-green-700 font-medium">
        In Stock
        {availableQuantity > 0 && availableQuantity < 10 && (
          <span className="text-gray-600 ml-1">({availableQuantity} left)</span>
        )}
      </span>
    </div>
  );
};

export default StockStatus;
