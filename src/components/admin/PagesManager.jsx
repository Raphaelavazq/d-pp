import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  FileText,
  Save,
  X,
  Calendar,
  User,
} from "lucide-react";

const PagesManager = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPage, setEditingPage] = useState(null);

  useEffect(() => {
    // Load pages from Firestore
    const loadPages = async () => {
      try {
        // Mock data - replace with actual Firestore calls
        setTimeout(() => {
          setPages([
            {
              id: "about",
              title: "About Us",
              slug: "about",
              type: "page",
              status: "published",
              content: `# About düpp

Welcome to düpp, where premium meets sustainability. We are committed to providing you with the finest selection of products that align with modern values of quality, ethics, and environmental responsibility.

## Our Mission

At düpp, we believe that commerce should be a force for good. Our mission is to curate and deliver premium products that not only meet your expectations but exceed them while supporting sustainable practices and ethical sourcing.

## Our Values

- **Quality First**: We source only the highest quality products
- **Sustainability**: Environmental responsibility is at our core
- **Transparency**: We believe in honest, open communication
- **Innovation**: Constantly improving and evolving

## Contact Us

Have questions? We'd love to hear from you. Reach out to our team at support@dupp.com or visit our contact page.`,
              metaTitle: "About düpp - Our Story & Mission",
              metaDescription:
                "Learn about düpp's mission to provide premium, sustainable products while supporting ethical practices and environmental responsibility.",
              author: "Admin",
              createdAt: "2025-01-15",
              updatedAt: "2025-08-03",
              featured: true,
            },
            {
              id: "faq",
              title: "Frequently Asked Questions",
              slug: "faq",
              type: "page",
              status: "published",
              content: `# Frequently Asked Questions

## Shipping & Delivery

### How long does shipping take?
We offer free standard shipping on orders over $50. Standard shipping typically takes 3-5 business days within the continental US.

### Do you ship internationally?
Yes! We ship to most countries worldwide. International shipping rates and delivery times vary by location.

### Can I track my order?
Absolutely! Once your order ships, you'll receive a tracking number via email.

## Returns & Exchanges

### What is your return policy?
We offer a 30-day return policy for unused items in original packaging. Customer is responsible for return shipping costs.

### How do I initiate a return?
Contact our customer service team at support@dupp.com with your order number to start the return process.

## Products

### Are your products really sustainable?
Yes! We carefully vet all our suppliers and products to ensure they meet our strict sustainability standards.

### Do you offer vegan options?
Many of our products are vegan-certified. Look for the "Vegan" badge on product pages.

## Account & Orders

### How do I create an account?
Click "Sign Up" in the top right corner of our website and follow the simple registration process.

### Can I modify my order after placing it?
Orders can be modified within 1 hour of placement. After that, please contact customer service for assistance.

## Still have questions?

Contact our friendly customer service team at support@dupp.com or through our contact form.`,
              metaTitle: "FAQ - Frequently Asked Questions | düpp",
              metaDescription:
                "Find answers to common questions about shipping, returns, products, and more. Get help with your düpp shopping experience.",
              author: "Admin",
              createdAt: "2025-01-10",
              updatedAt: "2025-07-28",
              featured: false,
            },
            {
              id: "privacy",
              title: "Privacy Policy",
              slug: "privacy",
              type: "page",
              status: "published",
              content: `# Privacy Policy

Last updated: August 3, 2025

## Information We Collect

We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.

### Personal Information
- Name and contact information
- Payment information
- Shipping addresses
- Order history and preferences

### Automatically Collected Information
- Browser and device information
- IP address and location data
- Usage patterns and preferences

## How We Use Your Information

- Process and fulfill orders
- Communicate about your account and orders
- Improve our products and services
- Send marketing communications (with your consent)
- Comply with legal obligations

## Information Sharing

We do not sell, trade, or rent your personal information to third parties. We may share your information with:

- Service providers who help us operate our business
- Law enforcement when required by law
- Business partners for joint marketing efforts (with your consent)

## Data Security

We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## Your Rights

You have the right to:
- Access your personal information
- Correct inaccurate information
- Delete your account and data
- Opt-out of marketing communications

## Contact Us

If you have questions about this Privacy Policy, please contact us at privacy@dupp.com.`,
              metaTitle: "Privacy Policy | düpp",
              metaDescription:
                "Read düpp's privacy policy to understand how we collect, use, and protect your personal information.",
              author: "Legal Team",
              createdAt: "2025-01-01",
              updatedAt: "2025-08-03",
              featured: false,
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading pages:", error);
        setLoading(false);
      }
    };

    loadPages();
  }, []);

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (page) => {
    setEditingPage({ ...page });
    setShowModal(true);
  };

  const handleDelete = async (pageId) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      setPages(pages.filter((p) => p.id !== pageId));
    }
  };

  const handleSave = async (pageData) => {
    try {
      if (editingPage) {
        // Update existing page
        setPages(
          pages.map((p) =>
            p.id === editingPage.id
              ? {
                  ...pageData,
                  id: editingPage.id,
                  updatedAt: new Date().toISOString().split("T")[0],
                }
              : p
          )
        );
      } else {
        // Create new page
        const newPage = {
          ...pageData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
          author: "Admin",
        };
        setPages([...pages, newPage]);
      }
      setShowModal(false);
      setEditingPage(null);
    } catch (error) {
      console.error("Error saving page:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Pages Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your website content pages ({pages.length} pages)
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPage(null);
            setShowModal(true);
          }}
          className="mt-4 sm:mt-0 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2 inline" />
          Add Page
        </button>
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

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPages.map((page) => (
          <div
            key={page.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {page.title}
                  </h3>
                  <p className="text-sm text-gray-500">/{page.slug}</p>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    page.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {page.status}
                </span>
              </div>
            </div>

            {/* Content Preview */}
            <div className="p-6">
              <div className="text-sm text-gray-600 mb-4 line-clamp-3">
                {page.content.substring(0, 150)}...
              </div>

              {/* Meta Info */}
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  {page.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Updated {page.updatedAt}
                </div>
              </div>

              {/* SEO Info */}
              {page.metaTitle && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    SEO Title:
                  </p>
                  <p className="text-xs text-gray-600">{page.metaTitle}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.open(`/${page.slug}`, "_blank")}
                    className="text-gray-400 hover:text-gray-600"
                    title="Preview Page"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(page)}
                    className="text-purple-600 hover:text-purple-900"
                    title="Edit Page"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete Page"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {page.featured && (
                  <span className="text-xs font-medium text-purple-600">
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPages.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No pages found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Try adjusting your search criteria."
              : "Get started by creating your first page."}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                onClick={() => {
                  setEditingPage(null);
                  setShowModal(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Page
              </button>
            </div>
          )}
        </div>
      )}

      {/* Page Modal */}
      {showModal && (
        <PageModal
          page={editingPage}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingPage(null);
          }}
        />
      )}
    </div>
  );
};

// Page Modal Component
const PageModal = ({ page, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    status: "published",
    featured: false,
  });

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || "",
        slug: page.slug || "",
        content: page.content || "",
        metaTitle: page.metaTitle || "",
        metaDescription: page.metaDescription || "",
        status: page.status || "published",
        featured: page.featured || false,
      });
    }
  }, [page]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {page ? "Edit Page" : "Add New Page"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 py-6 max-h-96 overflow-y-auto">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        required
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={generateSlug}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content (Markdown supported)
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                    placeholder="# Page Title

Write your content here using Markdown syntax..."
                  />
                </div>

                {/* SEO */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    SEO Settings
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        name="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleInputChange}
                        maxLength="60"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.metaTitle.length}/60 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description
                      </label>
                      <textarea
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleInputChange}
                        maxLength="160"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.metaDescription.length}/160 characters
                      </p>
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Page Settings
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Featured Page
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {page ? "Update Page" : "Create Page"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PagesManager;
