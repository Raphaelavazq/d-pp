import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Package,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Globe,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Upload,
  Download,
} from "lucide-react";
import ProductModal from "./ProductModal";
import { db } from "../../config/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const ProductsManagerReal = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterOrigin, setFilterOrigin] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    outOfStock: 0,
    bigBuyProducts: 0,
  });

  const PRODUCTS_PER_PAGE = 20;

  useEffect(() => {
    loadProducts();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory, filterOrigin, filterStatus]);

  useEffect(() => {
    if (searchTerm) {
      searchProducts();
    } else {
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const loadProducts = async (loadMore = false) => {
    try {
      if (!loadMore) {
        setLoading(true);
        setProducts([]);
        setLastDoc(null);
        setHasMore(true);
      }

      let q = query(collection(db, "products"), orderBy("createdAt", "desc"));

      // Apply filters
      if (filterCategory) {
        q = query(q, where("category", "==", filterCategory));
      }
      if (filterOrigin) {
        q = query(q, where("origin", "==", filterOrigin));
      }
      if (filterStatus) {
        q = query(q, where("status", "==", filterStatus));
      }

      // Add pagination
      if (loadMore && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      q = query(q, limit(PRODUCTS_PER_PAGE));

      const snapshot = await getDocs(q);
      const newProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Ensure required fields have defaults
        metaTitle:
          doc.data().metaTitle || `${doc.data().name} - Premium Quality`,
        metaDescription:
          doc.data().metaDescription || doc.data().description || "",
        slug:
          doc.data().slug ||
          doc
            .data()
            .name?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-"),
        imageAlt: doc.data().imageAlt || doc.data().name,
        tags: doc.data().tags || [],
        origin: doc.data().origin || "Manual",
        status: doc.data().status || "active",
        inStock:
          doc.data().inStock !== undefined
            ? doc.data().inStock
            : doc.data().stock > 0,
      }));

      if (loadMore) {
        setProducts((prev) => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === PRODUCTS_PER_PAGE);
    } catch (error) {
      console.error("Error loading products:", error);
      showNotification("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async () => {
    if (!searchTerm.trim()) {
      loadProducts();
      return;
    }

    try {
      setLoading(true);

      // Search by name (case-insensitive)
      const searchTermLower = searchTerm.toLowerCase();

      // Get all products and filter on client side for now
      // For better performance, consider implementing full-text search
      let q = query(collection(db, "products"), orderBy("name"));

      const snapshot = await getDocs(q);
      const searchResults = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          metaTitle:
            doc.data().metaTitle || `${doc.data().name} - Premium Quality`,
          metaDescription:
            doc.data().metaDescription || doc.data().description || "",
          slug:
            doc.data().slug ||
            doc
              .data()
              .name?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-"),
          imageAlt: doc.data().imageAlt || doc.data().name,
          tags: doc.data().tags || [],
          origin: doc.data().origin || "Manual",
          status: doc.data().status || "active",
          inStock:
            doc.data().inStock !== undefined
              ? doc.data().inStock
              : doc.data().stock > 0,
        }))
        .filter(
          (product) =>
            product.name?.toLowerCase().includes(searchTermLower) ||
            product.description?.toLowerCase().includes(searchTermLower) ||
            product.sku?.toLowerCase().includes(searchTermLower) ||
            product.tags?.some((tag) =>
              tag.toLowerCase().includes(searchTermLower)
            )
        );

      setProducts(searchResults);
      setHasMore(false);
    } catch (error) {
      console.error("Error searching products:", error);
      showNotification("Search failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Load product statistics
      const allProductsSnapshot = await getDocs(collection(db, "products"));
      const allProducts = allProductsSnapshot.docs.map((doc) => doc.data());

      const stats = {
        total: allProducts.length,
        active: allProducts.filter((p) => p.status === "active").length,
        outOfStock: allProducts.filter((p) => !p.inStock || p.stock === 0)
          .length,
        bigBuyProducts: allProducts.filter((p) => p.origin === "BigBuy").length,
      };

      setStats(stats);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showNotification("Product deleted successfully", "success");
      loadStats(); // Refresh stats
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification("Failed to delete product", "error");
    }
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await updateDoc(doc(db, "products", productId), {
        status: newStatus,
        updatedAt: new Date(),
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p))
      );

      showNotification(
        `Product ${newStatus === "active" ? "activated" : "deactivated"}`,
        "success"
      );
      loadStats(); // Refresh stats
    } catch (error) {
      console.error("Error updating product status:", error);
      showNotification("Failed to update product status", "error");
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) {
      showNotification("No products selected", "warning");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to ${action} ${selectedProducts.length} product(s)?`
      )
    ) {
      return;
    }

    try {
      const promises = selectedProducts.map(async (productId) => {
        if (action === "delete") {
          return deleteDoc(doc(db, "products", productId));
        } else if (action === "activate") {
          return updateDoc(doc(db, "products", productId), {
            status: "active",
            updatedAt: new Date(),
          });
        } else if (action === "deactivate") {
          return updateDoc(doc(db, "products", productId), {
            status: "inactive",
            updatedAt: new Date(),
          });
        }
      });

      await Promise.all(promises);

      if (action === "delete") {
        setProducts((prev) =>
          prev.filter((p) => !selectedProducts.includes(p.id))
        );
      } else {
        const newStatus = action === "activate" ? "active" : "inactive";
        setProducts((prev) =>
          prev.map((p) =>
            selectedProducts.includes(p.id) ? { ...p, status: newStatus } : p
          )
        );
      }

      setSelectedProducts([]);
      showNotification(`Bulk ${action} completed successfully`, "success");
      loadStats(); // Refresh stats
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      showNotification(`Bulk ${action} failed`, "error");
    }
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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOriginColor = (origin) => {
    switch (origin) {
      case "BigBuy":
        return "bg-blue-100 text-blue-800";
      case "Manual":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get unique values for filters
  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];
  const origins = [...new Set(products.map((p) => p.origin).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => loadProducts()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.outOfStock}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">BigBuy Products</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.bigBuyProducts}
              </p>
            </div>
            <Globe className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filterOrigin}
            onChange={(e) => setFilterOrigin(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Origins</option>
            {origins.map((origin) => (
              <option key={origin} value={origin}>
                {origin}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setFilterCategory("");
              setFilterOrigin("");
              setFilterStatus("");
              loadProducts();
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-800">
              {selectedProducts.length} product(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction("activate")}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction("deactivate")}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No products found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new product or adjusting your filters.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === products.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts(products.map((p) => p.id));
                          } else {
                            setSelectedProducts([]);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
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
                      Origin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts((prev) => [
                                ...prev,
                                product.id,
                              ]);
                            } else {
                              setSelectedProducts((prev) =>
                                prev.filter((id) => id !== product.id)
                              );
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.imageAlt || product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {product.sku || product.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.inStock && product.stock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.inStock && product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.category || "Uncategorized"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOriginColor(product.origin)}`}
                        >
                          {product.origin}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleToggleStatus(product.id, product.status)
                          }
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${getStatusColor(product.status)}`}
                        >
                          {product.status}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {product.origin === "BigBuy" && (
                            <a
                              href={`https://www.bigbuy.eu/en/product/${product.bigBuyId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Load More */}
            {hasMore && !loading && (
              <div className="p-4 text-center border-t">
                <button
                  onClick={() => loadProducts(true)}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Load More Products
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onSave={(productData) => {
            if (editingProduct) {
              // Update existing product
              setProducts((prev) =>
                prev.map((p) =>
                  p.id === editingProduct.id ? { ...p, ...productData } : p
                )
              );
            } else {
              // Add new product to list (it will be reloaded from Firestore)
              loadProducts();
            }
            setShowModal(false);
            setEditingProduct(null);
            showNotification(
              editingProduct
                ? "Product updated successfully"
                : "Product created successfully",
              "success"
            );
            loadStats(); // Refresh stats
          }}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductsManagerReal;
