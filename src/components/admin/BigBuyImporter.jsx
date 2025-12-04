import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  Package,
  Eye,
  Star,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Loader,
  RefreshCw,
  ShoppingCart,
  Tag,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import { db, functions } from "../../config/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const BigBuyImporter = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [importingIds, setImportingIds] = useState(new Set());
  const [importedProducts, setImportedProducts] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [notification, setNotification] = useState(null);

  // BigBuy categories (common ones)
  const bigBuyCategories = [
    { id: "", name: "All Categories" },
    { id: "1", name: "Electronics" },
    { id: "2", name: "Fashion" },
    { id: "3", name: "Home & Garden" },
    { id: "4", name: "Sports & Outdoor" },
    { id: "5", name: "Health & Beauty" },
    { id: "6", name: "Toys & Games" },
    { id: "7", name: "Automotive" },
    { id: "8", name: "Books & Media" },
  ];

  useEffect(() => {
    loadImportedProducts();
  }, []);

  const loadImportedProducts = async () => {
    try {
      const q = query(
        collection(db, "products"),
        where("origin", "==", "BigBuy")
      );
      const querySnapshot = await getDocs(q);
      const imported = new Set();
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.bigBuyId) {
          imported.add(data.bigBuyId.toString());
        }
      });
      setImportedProducts(imported);
    } catch (error) {
      console.error("Error loading imported products:", error);
    }
  };

  const searchBigBuyProducts = async () => {
    if (!searchTerm.trim() && !selectedCategory) {
      showNotification(
        "Please enter a search term or select a category",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      // Use Firebase callable function (more secure, no CORS issues)
      const { httpsCallable } = await import("firebase/functions");
      const searchFunction = httpsCallable(functions, "searchBigBuyProducts");

      const result = await searchFunction({
        query: searchTerm,
        category: selectedCategory,
        limit: 50,
      });

      if (result.data.success) {
        setSearchResults(result.data.data || []);
        showNotification(
          `Found ${result.data.data?.length || 0} products`,
          "success"
        );
      } else {
        showNotification(result.data.error || "Search failed", "error");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("BigBuy search error:", error);
      showNotification("Failed to search BigBuy products", "error");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const importProduct = async (bigBuyProduct) => {
    const productId = bigBuyProduct.id.toString();

    if (importedProducts.has(productId)) {
      showNotification("Product already imported", "warning");
      return;
    }

    setImportingIds((prev) => new Set(prev).add(productId));

    try {
      // Use Firebase callable function for getting product details
      const { httpsCallable } = await import("firebase/functions");
      const getDetailsFunction = httpsCallable(
        functions,
        "getBigBuyProductDetails"
      );

      const detailsResult = await getDetailsFunction({
        productId: bigBuyProduct.id,
      });

      if (!detailsResult.data.success) {
        throw new Error(
          detailsResult.data.error || "Failed to get product details"
        );
      }

      const productDetails = detailsResult.data.data;

      // Prepare product data for Firestore
      const productData = {
        // Basic info
        name: productDetails.name || bigBuyProduct.name,
        description:
          productDetails.description || bigBuyProduct.description || "",
        shortDescription: productDetails.shortDescription || "",

        // Pricing
        price: parseFloat(bigBuyProduct.price || productDetails.price || 0),
        originalPrice: parseFloat(
          bigBuyProduct.originalPrice || productDetails.originalPrice || 0
        ),
        wholesalePrice: parseFloat(
          bigBuyProduct.wholesalePrice || productDetails.wholesalePrice || 0
        ),

        // Images
        images: productDetails.images || bigBuyProduct.images || [],
        thumbnail: productDetails.thumbnail || bigBuyProduct.thumbnail || "",

        // Inventory
        stock: parseInt(productDetails.stock || bigBuyProduct.stock || 0),
        inStock: (productDetails.stock || bigBuyProduct.stock || 0) > 0,

        // Categories and tags
        category:
          productDetails.category || bigBuyProduct.category || "Uncategorized",
        subcategory:
          productDetails.subcategory || bigBuyProduct.subcategory || "",
        tags: productDetails.tags || bigBuyProduct.tags || [],
        brand: productDetails.brand || bigBuyProduct.brand || "",

        // BigBuy specific
        bigBuyId: bigBuyProduct.id,
        bigBuySku: productDetails.sku || bigBuyProduct.sku,
        origin: "BigBuy",

        // SEO
        slug: (productDetails.name || bigBuyProduct.name)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
        metaTitle: `${productDetails.name || bigBuyProduct.name} - Premium Quality`,
        metaDescription: (
          productDetails.description ||
          bigBuyProduct.description ||
          ""
        ).substring(0, 160),

        // Timestamps
        createdAt: new Date(),
        updatedAt: new Date(),
        importedAt: new Date(),

        // Status
        status: "active",
        featured: false,
        visible: true,

        // Attributes
        attributes: productDetails.attributes || {},
        variations: productDetails.variations || [],

        // Shipping
        weight: productDetails.weight || 0,
        dimensions: productDetails.dimensions || {},

        // Additional
        warranty: productDetails.warranty || "",
        minimumOrderQuantity: productDetails.minimumOrderQuantity || 1,
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, "products"), productData);

      // Update imported products set
      setImportedProducts((prev) => new Set(prev).add(productId));

      showNotification(
        `Product "${productData.name}" imported successfully!`,
        "success"
      );

      // Log the import for analytics
      console.log("Product imported:", {
        firestoreId: docRef.id,
        bigBuyId: bigBuyProduct.id,
        name: productData.name,
      });
    } catch (error) {
      console.error("Import error:", error);
      showNotification(`Failed to import product: ${error.message}`, "error");
    } finally {
      setImportingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const previewProduct = (product) => {
    setSelectedProduct(product);
    setShowPreview(true);
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(price || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            BigBuy Product Importer
          </h2>
          <p className="text-gray-600">
            Search and import products from BigBuy catalog
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Package className="w-4 h-4" />
          <span>{importedProducts.size} products imported</span>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`p-4 rounded-lg flex items-center space-x-2 ${
            notification.type === "success"
              ? "bg-green-50 text-green-800"
              : notification.type === "error"
                ? "bg-red-50 text-red-800"
                : notification.type === "warning"
                  ? "bg-yellow-50 text-yellow-800"
                  : "bg-blue-50 text-blue-800"
          }`}
        >
          {notification.type === "success" && (
            <CheckCircle className="w-5 h-5" />
          )}
          {notification.type === "error" && <AlertCircle className="w-5 h-5" />}
          {notification.type === "warning" && (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Search Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchBigBuyProducts()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Search BigBuy products"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              aria-label="Filter by category"
            >
              {bigBuyCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={searchBigBuyProducts}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            aria-label="Search BigBuy products"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results ({searchResults.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {searchResults.map((product) => {
                  const productId = product.id.toString();
                  const isImported = importedProducts.has(productId);
                  const isImporting = importingIds.has(productId);

                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-2">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              SKU: {product.sku || product.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {formatPrice(product.price)}
                          </div>
                          {product.originalPrice &&
                            product.originalPrice > product.price && (
                              <div className="text-gray-500 line-through">
                                {formatPrice(product.originalPrice)}
                              </div>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            (product.stock || 0) > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {(product.stock || 0) > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.category || "Uncategorized"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => previewProduct(product)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            aria-label="Preview product"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {isImported ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Imported
                            </span>
                          ) : (
                            <button
                              onClick={() => importProduct(product)}
                              disabled={isImporting}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                              aria-label="Import product"
                            >
                              {isImporting ? (
                                <>
                                  <Loader className="w-3 h-3 animate-spin" />
                                  <span>Importing...</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  <span>Import</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && searchResults.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No products found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms or category filter.
          </p>
        </div>
      )}

      {/* Product Preview Modal */}
      {showPreview && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Product Preview
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close preview"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {selectedProduct.thumbnail && (
                  <img
                    src={selectedProduct.thumbnail}
                    alt={selectedProduct.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}

                <div>
                  <h4 className="font-medium text-gray-900">
                    {selectedProduct.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Price:</span>
                    <p className="font-medium">
                      {formatPrice(selectedProduct.price)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Stock:</span>
                    <p className="font-medium">{selectedProduct.stock || 0}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Category:</span>
                    <p className="font-medium">
                      {selectedProduct.category || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Brand:</span>
                    <p className="font-medium">
                      {selectedProduct.brand || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      importProduct(selectedProduct);
                      setShowPreview(false);
                    }}
                    disabled={importedProducts.has(
                      selectedProduct.id.toString()
                    )}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {importedProducts.has(selectedProduct.id.toString())
                      ? "Already Imported"
                      : "Import Product"}
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BigBuyImporter;
