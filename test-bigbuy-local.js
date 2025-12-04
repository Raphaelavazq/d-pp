// Test BigBuy API Connection via Local Firebase Functions
import { initializeApp } from "firebase/app";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";

// Firebase config (same as in your project)
const firebaseConfig = {
  projectId: "dupp-af67a", // Your project ID
  // Add other config if needed for local testing
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// Connect to local emulator
connectFunctionsEmulator(functions, "localhost", 5001);

async function testBigBuyAPI() {
  console.log("🚀 Testing BigBuy API via Local Firebase Functions...\n");

  try {
    // Test 1: Search BigBuy Products
    console.log("1️⃣ Testing searchBigBuyProducts function...");
    const searchFunction = httpsCallable(functions, "searchBigBuyProducts");

    const searchResult = await searchFunction({
      query: "electronics",
      category: "",
      limit: 5,
    });

    console.log("✅ Search result:", {
      success: searchResult.data.success,
      productsCount: searchResult.data.data?.length || 0,
      firstProduct: searchResult.data.data?.[0]?.name || "No products",
    });

    if (searchResult.data.success && searchResult.data.data?.length > 0) {
      // Test 2: Get Product Details
      console.log("\n2️⃣ Testing getBigBuyProductDetails function...");
      const detailsFunction = httpsCallable(
        functions,
        "getBigBuyProductDetails"
      );

      const productId = searchResult.data.data[0].id;
      const detailsResult = await detailsFunction({
        productId: productId,
      });

      console.log("✅ Product details result:", {
        success: detailsResult.data.success,
        productName: detailsResult.data.data?.name || "No name",
        hasImages: (detailsResult.data.data?.images?.length || 0) > 0,
        price: detailsResult.data.data?.price || "No price",
      });
    }

    // Test 3: Get Categories
    console.log("\n3️⃣ Testing getBigBuyCategories function...");
    const categoriesFunction = httpsCallable(functions, "getBigBuyCategories");

    const categoriesResult = await categoriesFunction();

    console.log("✅ Categories result:", {
      success: categoriesResult.data.success,
      categoriesCount: categoriesResult.data.data?.length || 0,
      firstCategory: categoriesResult.data.data?.[0]?.name || "No categories",
    });

    console.log("\n🎉 All tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      details: error.details,
    });
  }
}

// Mock authentication for testing (you'll need to replace this with real auth)
console.log(
  "⚠️  Note: This test requires admin authentication to work properly."
);
console.log("If you get authentication errors, you need to:");
console.log("1. Be logged in as an admin user");
console.log("2. Have proper Firebase auth context");
console.log("3. Or modify the functions to skip auth for testing\n");

// Run the test
testBigBuyAPI();
