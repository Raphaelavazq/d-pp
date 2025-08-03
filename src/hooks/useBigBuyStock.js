import { useState, useEffect, useCallback } from "react";

/**
 * GDPR-compliant hook for checking BigBuy stock
 * - No personal data transmission
 * - No user-specific caching
 * - Minimal data retention
 */
export const useBigBuyStock = (productId) => {
  const [stockInfo, setStockInfo] = useState({
    inStock: true, // Optimistic default
    availableQuantity: 0,
    isLoading: false,
    error: null,
    lastChecked: null,
  });

  const checkStock = useCallback(async () => {
    if (!productId) {
      setStockInfo((prev) => ({
        ...prev,
        inStock: false,
        availableQuantity: 0,
        isLoading: false,
        error: "No product ID provided",
      }));
      return;
    }

    setStockInfo((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Use environment variable for the Firebase Function URL
      const functionUrl =
        import.meta.env.VITE_FIREBASE_FUNCTIONS_URL ||
        `https://europe-west1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net`;

      const response = await fetch(
        `${functionUrl}/checkBigBuyStock?productId=${encodeURIComponent(productId)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // No credentials needed for stock checks (GDPR compliance)
          credentials: "omit",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      setStockInfo({
        inStock: data.inStock,
        availableQuantity: data.availableQuantity,
        isLoading: false,
        error: data.error || null,
        lastChecked: new Date(),
      });
    } catch (error) {
      console.error("Stock check failed:", error);

      setStockInfo((prev) => ({
        ...prev,
        inStock: false, // Fail safe: assume out of stock on error
        availableQuantity: 0,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to check stock",
        lastChecked: new Date(),
      }));
    }
  }, [productId]);

  // Check stock on mount and when productId changes
  useEffect(() => {
    if (productId) {
      checkStock();
    }
  }, [productId, checkStock]);

  // Provide manual refresh function
  const refreshStock = useCallback(() => {
    if (productId) {
      checkStock();
    }
  }, [checkStock, productId]);

  return {
    ...stockInfo,
    refreshStock,
  };
};
