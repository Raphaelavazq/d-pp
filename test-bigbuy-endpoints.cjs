// Quick BigBuy API test with correct endpoints
const https = require("https");

const API_KEY =
  "MGMzOTg1ZWE1NTU0ZDQ1NzcxYjA5ODRhNDczNTE0NTc2Y2IzMjRlOGIwYTExYjc1OGM4ZGU3Yzg0OGI1YzYxMg";

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.sandbox.bigbuy.eu", // Try sandbox environment
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

async function testBigBuyEndpoints() {
  console.log("🚀 Testing BigBuy API Endpoints...\n");

  // Test endpoints with .json format
  const endpoints = [
    "/rest/user/auth/status.json",
    "/rest/catalog/products.json?limit=1",
    "/rest/catalog/categories.json?limit=1",
  ];

  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint}`);
    try {
      const result = await makeRequest(endpoint);
      console.log(`✅ Status: ${result.status}`);

      if (result.status === 200) {
        console.log(
          `   Success! Data keys: ${Object.keys(result.data || {}).join(", ")}`
        );
      } else {
        console.log(`   Response: ${JSON.stringify(result.data)}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    console.log("");
  }
}

testBigBuyEndpoints();
