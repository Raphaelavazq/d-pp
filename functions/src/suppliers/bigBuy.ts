import {
  SupplierInterface,
  SupplierProduct,
  SupplierRegistry,
} from "./supplierInterface";

interface BigBuyApiProduct {
  id: number;
  name: string;
  description: string;
  retailPrice: string;
  wholeSalePrice: string;
  category: { id: number; name: string };
  subcategory?: { id: number; name: string };
  brand?: { id: number; name: string };
  images: { url: string }[];
  stock: string;
  active: boolean;
  weight: string;
  dimensions?: {
    length: string;
    width: string;
    height: string;
  };
  ean: string;
  sku: string;
}

export class BigBuySupplier implements SupplierInterface {
  name = "BigBuy";
  private apiKey: string;
  private apiUrl: string;
  public isConfigured: boolean = false;

  constructor() {
    // Use Firebase config for now (deprecated but still works)
    this.apiKey = process.env.BIGBUY_API_KEY || "";
    this.apiUrl = process.env.BIGBUY_API_URL || "https://api.bigbuy.eu/rest";

    if (!this.apiKey) {
      console.warn(
        "BigBuy API key not configured - supplier will be unavailable"
      );
      this.isConfigured = false;
      return;
    }

    this.isConfigured = true;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  private transformProduct(bigBuyProduct: BigBuyApiProduct): SupplierProduct {
    return {
      id: bigBuyProduct.id.toString(),
      name: bigBuyProduct.name,
      description: bigBuyProduct.description || "",
      price: parseFloat(bigBuyProduct.retailPrice) || 0,
      originalPrice: parseFloat(bigBuyProduct.wholeSalePrice) || undefined,
      category: bigBuyProduct.category?.name || "Uncategorized",
      subcategory: bigBuyProduct.subcategory?.name,
      brand: bigBuyProduct.brand?.name,
      images: bigBuyProduct.images?.map((img) => img.url) || [],
      stock: parseInt(bigBuyProduct.stock) || 0,
      active: bigBuyProduct.active === true,
      weight: parseFloat(bigBuyProduct.weight) || undefined,
      dimensions: bigBuyProduct.dimensions
        ? {
            length: parseFloat(bigBuyProduct.dimensions.length) || 0,
            width: parseFloat(bigBuyProduct.dimensions.width) || 0,
            height: parseFloat(bigBuyProduct.dimensions.height) || 0,
          }
        : undefined,
      ean: bigBuyProduct.ean,
      sku: bigBuyProduct.sku,
      supplier: "bigbuy",
      supplierProductId: bigBuyProduct.id.toString(),
    };
  }

  async searchProducts(
    query: string,
    category?: string,
    limit: number = 50
  ): Promise<SupplierProduct[]> {
    try {
      const searchParams = new URLSearchParams({
        limit: Math.min(limit, 100).toString(),
      });

      if (query) {
        searchParams.append("search", query);
      }
      if (category) {
        searchParams.append("category", category);
      }

      const response = await fetch(
        `${this.apiUrl}/catalog/products?${searchParams}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`BigBuy API error: ${response.status}`);
      }

      const data = await response.json();
      const products = data.products || [];

      return products.map((product: BigBuyApiProduct) =>
        this.transformProduct(product)
      );
    } catch (error) {
      console.error("BigBuy search error:", error);
      throw error;
    }
  }

  async getProductDetails(productId: string): Promise<SupplierProduct> {
    try {
      const response = await fetch(
        `${this.apiUrl}/catalog/products/${productId}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`BigBuy API error: ${response.status}`);
      }

      const product = await response.json();
      return this.transformProduct(product);
    } catch (error) {
      console.error("BigBuy product details error:", error);
      throw error;
    }
  }

  async checkStock(productId: string): Promise<number> {
    try {
      const response = await fetch(
        `${this.apiUrl}/catalog/products/${productId}/stock`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`BigBuy API error: ${response.status}`);
      }

      const stockData = await response.json();
      return stockData.quantity || 0;
    } catch (error) {
      console.error("BigBuy stock check error:", error);
      throw error;
    }
  }

  async syncStock(
    productIds: string[]
  ): Promise<{ productId: string; stock: number; success: boolean }[]> {
    const results = [];

    for (const productId of productIds.slice(0, 100)) {
      // Limit batch size
      try {
        // Extract BigBuy ID from our product ID format
        const bigBuyId = productId.replace("bigbuy-", "");
        const stock = await this.checkStock(bigBuyId);

        results.push({
          productId,
          stock,
          success: true,
        });
      } catch (error) {
        console.error(`Failed to sync stock for ${productId}:`, error);
        results.push({
          productId,
          stock: 0,
          success: false,
        });
      }
    }

    return results;
  }

  async getCategories(): Promise<
    { id: string; name: string; parentId?: string }[]
  > {
    try {
      const response = await fetch(`${this.apiUrl}/catalog/categories`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`BigBuy API error: ${response.status}`);
      }

      const data = await response.json();
      const categories = data.categories || [];

      return categories.map((cat: any) => ({
        id: cat.id.toString(),
        name: cat.name,
        parentId: cat.parentId ? cat.parentId.toString() : undefined,
      }));
    } catch (error) {
      console.error("BigBuy categories error:", error);
      throw error;
    }
  }
}

// Register BigBuy supplier
try {
  const bigBuySupplier = new BigBuySupplier();
  if (bigBuySupplier.isConfigured) {
    SupplierRegistry.register("bigbuy", bigBuySupplier);
    console.log("BigBuy supplier registered successfully");
  } else {
    console.log("BigBuy supplier not registered - API key not available");
  }
} catch (error) {
  console.error("Failed to register BigBuy supplier:", error);
}
