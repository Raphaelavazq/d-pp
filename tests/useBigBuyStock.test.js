import { describe, it, expect, vi, beforeEach } from "vitest";
import { useBigBuyStock } from "../src/hooks/useBigBuyStock";
import { renderHook, waitFor } from "@testing-library/react";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Mock environment variables
vi.mock("import.meta", () => ({
  env: {
    VITE_FIREBASE_PROJECT_ID: "test-project",
    VITE_FIREBASE_FUNCTIONS_URL:
      "https://europe-west1-test-project.cloudfunctions.net",
  },
}));

describe("useBigBuyStock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return loading state initially", () => {
    const { result } = renderHook(() => useBigBuyStock("test-product-123"));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.inStock).toBe(true); // Optimistic default
  });

  it("should fetch stock data successfully", async () => {
    const mockResponse = {
      inStock: true,
      availableQuantity: 15,
      productId: "test-product-123",
      timestamp: "2025-08-03T10:00:00Z",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useBigBuyStock("test-product-123"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.inStock).toBe(true);
    expect(result.current.availableQuantity).toBe(15);
    expect(result.current.error).toBe(null);
  });

  it("should handle out of stock products", async () => {
    const mockResponse = {
      inStock: false,
      availableQuantity: 0,
      productId: "test-product-123",
      timestamp: "2025-08-03T10:00:00Z",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useBigBuyStock("test-product-123"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.inStock).toBe(false);
    expect(result.current.availableQuantity).toBe(0);
  });

  it("should handle API errors gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useBigBuyStock("test-product-123"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.inStock).toBe(false); // Fail safe
    expect(result.current.availableQuantity).toBe(0);
    expect(result.current.error).toBe("Network error");
  });

  it("should handle missing product ID", () => {
    const { result } = renderHook(() => useBigBuyStock(null));

    expect(result.current.inStock).toBe(false);
    expect(result.current.error).toBe("No product ID provided");
  });

  it("should make GDPR-compliant requests", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ inStock: true, availableQuantity: 5 }),
    });

    renderHook(() => useBigBuyStock("test-product-123"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("checkBigBuyStock?productId=test-product-123"),
        expect.objectContaining({
          method: "GET",
          credentials: "omit", // No credentials for GDPR compliance
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });
  });
});
