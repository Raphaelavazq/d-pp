// Test BigBuy API Connection
// This script tests the BigBuy API connectivity and validates the API endpoints

const API_KEY =
  "Nzg2NjY2Zjc0ZTJkOTQ3YWJhYmM3ZWZlZGQwZDVkNTNjMGIyMTdhNmY4NWNkMTE0MDk5YTcyYzBlNmJhYWQyNw";
const BIGBUY_API_BASE = "https://api.bigbuy.eu";

// Test authentication status
async function testAuthStatus() {
  try {
    console.log("🔐 Testing BigBuy API authentication...");

    const response = await fetch(
      `${BIGBUY_API_BASE}/rest/user/auth/status.json`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Authentication successful:", data);
      return true;
    } else {
      console.log(
        "❌ Authentication failed:",
        response.status,
        response.statusText
      );
      const errorText = await response.text();
      console.log("Error response:", errorText);
      return false;
    }
  } catch (error) {
    console.error("🚨 Network error during auth test:", error);
    return false;
  }
}

// Test products endpoint
async function testProductsEndpoint() {
  try {
    console.log("\n📦 Testing BigBuy products endpoint...");

    const response = await fetch(
      `${BIGBUY_API_BASE}/rest/catalog/products.json?limit=5`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Products endpoint working:", {
        totalProducts: data.length || data.data?.length || 0,
        sampleProduct: data[0] || data.data?.[0] || "No products returned",
      });
      return true;
    } else {
      console.log(
        "❌ Products endpoint failed:",
        response.status,
        response.statusText
      );
      const errorText = await response.text();
      console.log("Error response:", errorText);
      return false;
    }
  } catch (error) {
    console.error("🚨 Network error during products test:", error);
    return false;
  }
}

// Test categories endpoint
async function testCategoriesEndpoint() {
  try {
    console.log("\n🏷️ Testing BigBuy categories endpoint...");

    const response = await fetch(
      `${BIGBUY_API_BASE}/rest/catalog/categories.json`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Categories endpoint working:", {
        totalCategories: data.length || data.data?.length || 0,
        sampleCategory: data[0] || data.data?.[0] || "No categories returned",
      });
      return true;
    } else {
      console.log(
        "❌ Categories endpoint failed:",
        response.status,
        response.statusText
      );
      const errorText = await response.text();
      console.log("Error response:", errorText);
      return false;
    }
  } catch (error) {
    console.error("🚨 Network error during categories test:", error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log("🚀 Starting BigBuy API connectivity tests...\n");

  const authResult = await testAuthStatus();
  const productsResult = await testProductsEndpoint();
  const categoriesResult = await testCategoriesEndpoint();

  console.log("\n📊 Test Results Summary:");
  console.log(`Authentication: ${authResult ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`Products API: ${productsResult ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`Categories API: ${categoriesResult ? "✅ PASS" : "❌ FAIL"}`);

  if (authResult && productsResult && categoriesResult) {
    console.log("\n🎉 All tests passed! BigBuy API is working correctly.");
  } else {
    console.log("\n⚠️ Some tests failed. Check the API key and endpoints.");
  }
}

// Run tests if this file is executed directly
runAllTests();
