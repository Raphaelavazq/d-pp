import React, { useState, useEffect } from "react";
import {
  Search,
  Globe,
  TrendingUp,
  ExternalLink,
  Edit3,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
} from "lucide-react";

const SEOManager = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load SEO data for all pages
    const loadSEOData = async () => {
      try {
        // Mock data - replace with actual Firestore calls
        setTimeout(() => {
          setPages([
            {
              id: "home",
              title: "Home",
              url: "/",
              metaTitle: "düpp - Premium E-Commerce Experience",
              metaDescription:
                "Discover premium products with düpp. Sustainable, vegan, and cruelty-free options for modern living.",
              metaKeywords:
                "ecommerce, premium, sustainable, vegan, cruelty-free",
              ogTitle: "düpp - Premium E-Commerce",
              ogDescription: "Premium products for modern living",
              ogImage: "https://dupp.com/images/og-home.jpg",
              canonicalUrl: "https://dupp.com/",
              lastUpdated: "2025-08-03",
              seoScore: 85,
              status: "published",
            },
            {
              id: "shop",
              title: "Shop",
              url: "/shop",
              metaTitle: "Shop Premium Products - düpp",
              metaDescription:
                "Browse our curated collection of premium, sustainable products. Free shipping on orders over $50.",
              metaKeywords: "shop, products, premium, sustainable",
              ogTitle: "Shop Premium Products",
              ogDescription: "Curated collection of premium products",
              ogImage: "https://dupp.com/images/og-shop.jpg",
              canonicalUrl: "https://dupp.com/shop",
              lastUpdated: "2025-08-02",
              seoScore: 92,
              status: "published",
            },
            {
              id: "about",
              title: "About",
              url: "/about",
              metaTitle: "About düpp - Our Story & Mission",
              metaDescription:
                "Learn about düpp's mission to provide premium, sustainable products while supporting ethical practices.",
              metaKeywords: "about, mission, sustainable, ethical",
              ogTitle: "About düpp",
              ogDescription: "Our mission for sustainable commerce",
              ogImage: "https://dupp.com/images/og-about.jpg",
              canonicalUrl: "https://dupp.com/about",
              lastUpdated: "2025-08-01",
              seoScore: 78,
              status: "published",
            },
            {
              id: "contact",
              title: "Contact",
              url: "/contact",
              metaTitle: "Contact düpp - Get in Touch",
              metaDescription:
                "Contact düpp customer service. We're here to help with your orders, returns, and questions.",
              metaKeywords: "contact, support, customer service",
              ogTitle: "Contact düpp",
              ogDescription: "Get in touch with our team",
              ogImage: "https://dupp.com/images/og-contact.jpg",
              canonicalUrl: "https://dupp.com/contact",
              lastUpdated: "2025-07-30",
              seoScore: 73,
              status: "published",
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading SEO data:", error);
        setLoading(false);
      }
    };

    loadSEOData();
  }, []);

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (page) => {
    setEditingPage({ ...page });
  };

  const handleSave = async () => {
    try {
      // Update page SEO in Firestore
      setPages(
        pages.map((page) => (page.id === editingPage.id ? editingPage : page))
      );
      setEditingPage(null);
    } catch (error) {
      console.error("Error saving SEO data:", error);
    }
  };

  const handleCancel = () => {
    setEditingPage(null);
  };

  const getSEOScoreColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-yellow-600 bg-yellow-100";
    if (score >= 70) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Management</h1>
          <p className="text-gray-600 mt-1">
            Optimize your pages for search engines and social media
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
            <TrendingUp className="w-4 h-4 mr-2 inline" />
            SEO Report
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meta Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SEO Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {page.title}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Globe className="w-3 h-3 mr-1" />
                        {page.url}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {page.metaTitle}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {page.metaTitle.length}/60 characters
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSEOScoreColor(page.seoScore)}`}
                    >
                      {page.seoScore}/100
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {page.lastUpdated}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => window.open(page.url, "_blank")}
                        className="text-gray-400 hover:text-gray-600"
                        title="Preview Page"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(page)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Edit SEO"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleCancel}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {/* Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    SEO Settings - {editingPage.title}
                  </h3>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white px-6 py-6 max-h-96 overflow-y-auto">
                <div className="space-y-6">
                  {/* Basic SEO */}
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Title *
                      </label>
                      <input
                        type="text"
                        value={editingPage.metaTitle}
                        onChange={(e) =>
                          setEditingPage((prev) => ({
                            ...prev,
                            metaTitle: e.target.value,
                          }))
                        }
                        maxLength="60"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      />
                      <p className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                        <span>
                          Characters: {editingPage.metaTitle.length}/60
                        </span>
                        {editingPage.metaTitle.length > 60 && (
                          <span className="text-red-500 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Too long
                          </span>
                        )}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description *
                      </label>
                      <textarea
                        value={editingPage.metaDescription}
                        onChange={(e) =>
                          setEditingPage((prev) => ({
                            ...prev,
                            metaDescription: e.target.value,
                          }))
                        }
                        maxLength="160"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      />
                      <p className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                        <span>
                          Characters: {editingPage.metaDescription.length}/160
                        </span>
                        {editingPage.metaDescription.length > 160 && (
                          <span className="text-red-500 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Too long
                          </span>
                        )}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Keywords
                      </label>
                      <input
                        type="text"
                        value={editingPage.metaKeywords}
                        onChange={(e) =>
                          setEditingPage((prev) => ({
                            ...prev,
                            metaKeywords: e.target.value,
                          }))
                        }
                        placeholder="keyword1, keyword2, keyword3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Canonical URL
                      </label>
                      <input
                        type="url"
                        value={editingPage.canonicalUrl}
                        onChange={(e) =>
                          setEditingPage((prev) => ({
                            ...prev,
                            canonicalUrl: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Open Graph */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Open Graph (Social Media)
                    </h4>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          OG Title
                        </label>
                        <input
                          type="text"
                          value={editingPage.ogTitle}
                          onChange={(e) =>
                            setEditingPage((prev) => ({
                              ...prev,
                              ogTitle: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          OG Description
                        </label>
                        <textarea
                          value={editingPage.ogDescription}
                          onChange={(e) =>
                            setEditingPage((prev) => ({
                              ...prev,
                              ogDescription: e.target.value,
                            }))
                          }
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          OG Image URL
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="url"
                            value={editingPage.ogImage}
                            onChange={(e) =>
                              setEditingPage((prev) => ({
                                ...prev,
                                ogImage: e.target.value,
                              }))
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                          />
                          {editingPage.ogImage && (
                            <button
                              onClick={() =>
                                window.open(editingPage.ogImage, "_blank")
                              }
                              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SEO Preview */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Search Result Preview
                    </h4>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                        {editingPage.metaTitle || editingPage.title}
                      </div>
                      <div className="text-green-700 text-sm">
                        {editingPage.canonicalUrl ||
                          `https://dupp.com${editingPage.url}`}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        {editingPage.metaDescription ||
                          "No meta description provided."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOManager;
