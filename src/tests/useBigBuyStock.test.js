import { describe, it, expect, vi, beforeEach } from "vitest";
import { useBigBuyStock } from "../src/hooks/useBigBuyStock";
import { renderHook, waitFor } from "@testing-library/react";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("useBigBuyStock Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_FIREBASE_PROJECT_ID", "test-project");
  });

  it("should return loading state initially", () => {
    const { result } = renderHook(() => useBigBuyStock("test-product-123"));

    expect(result.current.inStock).toBe(true); // Optimistic default
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it("should handle successful stock response", async () => {
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

  it("should handle out of stock response", async () => {
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

    expect(result.current.inStock).toBe(false); // Fail-safe default
    expect(result.current.availableQuantity).toBe(0);
    expect(result.current.error).toBe("Network error");
  });

  it("should handle invalid product ID", () => {
    const { result } = renderHook(() => useBigBuyStock(null));

    expect(result.current.inStock).toBe(false);
    expect(result.current.error).toBe("No product ID provided");
    expect(result.current.isLoading).toBe(false);
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
          credentials: "omit", // GDPR compliance: no credentials
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });
  });
});
