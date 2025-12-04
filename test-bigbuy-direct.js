// Simple BigBuy API Test - Direct API calls
const https = require("https");

const API_KEY =
  "Nzg2NjY2Zjc0ZTJkOTQ3YWJhYmM3ZWZlZGQwZDVkNTNjMGIyMTdhNmY4NWNkMTE0MDk5YTcyYzBlNmJhYWQyNw";
const BIGBUY_API_BASE = "https://api.bigbuy.eu";

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.bigbuy.eu",
      path: path,
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
            parseError: e.message,
          });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.abort();
      reject(new Error("Request timeout"));
    });

    req.end();
  });
}

async function testBigBuyAPI() {
  console.log("🚀 Testing BigBuy API Direct Connection...\n");

  // Test 1: Authentication Status
  console.log("1️⃣ Testing Authentication Status...");
  try {
    const authResult = await makeRequest("/rest/user/auth/status.json");
    console.log(`✅ Auth Status: ${authResult.status}`);
    console.log(`   Response:`, authResult.data);
    console.log(
      `   Rate Limit:`,
      authResult.headers["x-ratelimit-limit"] || "Not provided"
    );
  } catch (error) {
    console.log("❌ Auth test failed:", error.message);
  }

  // Test 2: Products Endpoint
  console.log("\n2️⃣ Testing Products Endpoint...");
  try {
    const productsResult = await makeRequest(
      "/rest/catalog/products.json?limit=3"
    );
    console.log(`✅ Products Status: ${productsResult.status}`);

    if (productsResult.data && Array.isArray(productsResult.data)) {
      console.log(`   Found ${productsResult.data.length} products`);
      if (productsResult.data.length > 0) {
        console.log(
          `   First product: ${productsResult.data[0].name || "No name"}`
        );
      }
    } else if (productsResult.data && productsResult.data.data) {
      console.log(
        `   Found ${productsResult.data.data.length} products (nested)`
      );
      if (productsResult.data.data.length > 0) {
        console.log(
          `   First product: ${productsResult.data.data[0].name || "No name"}`
        );
      }
    } else {
      console.log(
        `   Response structure:`,
        Object.keys(productsResult.data || {})
      );
    }
  } catch (error) {
    console.log("❌ Products test failed:", error.message);
  }

  // Test 3: Categories Endpoint
  console.log("\n3️⃣ Testing Categories Endpoint...");
  try {
    const categoriesResult = await makeRequest("/rest/catalog/categories.json");
    console.log(`✅ Categories Status: ${categoriesResult.status}`);

    if (categoriesResult.data && Array.isArray(categoriesResult.data)) {
      console.log(`   Found ${categoriesResult.data.length} categories`);
      if (categoriesResult.data.length > 0) {
        console.log(
          `   First category: ${categoriesResult.data[0].name || "No name"}`
        );
      }
    } else if (categoriesResult.data && categoriesResult.data.data) {
      console.log(
        `   Found ${categoriesResult.data.data.length} categories (nested)`
      );
      if (categoriesResult.data.data.length > 0) {
        console.log(
          `   First category: ${categoriesResult.data.data[0].name || "No name"}`
        );
      }
    } else {
      console.log(
        `   Response structure:`,
        Object.keys(categoriesResult.data || {})
      );
    }
  } catch (error) {
    console.log("❌ Categories test failed:", error.message);
  }

  console.log("\n📊 Test Summary:");
  console.log("- Direct API connection to BigBuy");
  console.log("- Using provided API key");
  console.log("- Testing main endpoints");
  console.log("\nIf all tests pass, the BigBuy integration should work!");
}

// Run the test
testBigBuyAPI().catch(console.error);
