#!/usr/bin/env node

// 🚀 Google Auth Setup - Node.js version
// Cross-platform setup script

import { execSync, spawn } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import readline from "readline";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const print = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.cyan}🔧 ${msg}${colors.reset}`),
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) =>
  new Promise((resolve) => {
    rl.question(prompt, resolve);
  });

async function openUrl(url) {
  const platform = process.platform;
  let command;

  if (platform === "darwin") {
    command = "open";
  } else if (platform === "win32") {
    command = "start";
  } else {
    command = "xdg-open";
  }

  try {
    execSync(`${command} "${url}"`, { stdio: "ignore" });
    print.success(`Opened ${url} in browser`);
  } catch (error) {
    print.info(`Please open this URL manually: ${url}`);
  }
}

async function checkPrerequisites() {
  print.step("Checking prerequisites...");

  if (!existsSync("package.json")) {
    print.error(
      "Not in a Node.js project directory. Please run this from your project root."
    );
    process.exit(1);
  }

  if (!existsSync("src/config/firebase.js")) {
    print.error(
      "Firebase configuration not found. Please run the authentication setup first."
    );
    process.exit(1);
  }

  print.success("Prerequisites check passed");
}

async function checkFirebaseConfig() {
  print.step("Checking Firebase configuration...");

  if (existsSync(".env")) {
    const envContent = readFileSync(".env", "utf8");
    if (
      envContent.includes("demo-api-key-replace-me") ||
      envContent.includes("your_api_key_here")
    ) {
      print.warning(
        "Using demo Firebase credentials. You'll need real credentials for Google auth."
      );
      console.log("\nDo you want to:");
      console.log(
        "1) Continue with Firebase Console setup to get real credentials"
      );
      console.log("2) Skip and use demo mode (Google auth won't work)");

      const choice = await question("\nChoose (1 or 2): ");

      if (choice === "2") {
        print.info(
          "Skipping Firebase setup. Google auth will not work until you configure real credentials."
        );
        process.exit(0);
      }
    } else {
      print.success("Firebase credentials found in .env file");
      return;
    }
  } else {
    print.error(".env file not found. Creating template...");
    const envTemplate = `# Firebase Configuration - REPLACE WITH YOUR ACTUAL VALUES
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_actual_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Other
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_demo_key
VITE_ALIEXPRESS_API_KEY=your_aliexpress_api_key
`;
    writeFileSync(".env", envTemplate);
    print.success(
      "Created .env template. You'll need to fill in real Firebase credentials."
    );
  }
}

async function setupGoogleAuth() {
  console.log("🔑 Google Authentication Node.js Setup Tool");
  console.log("===========================================\n");

  await checkPrerequisites();
  await checkFirebaseConfig();

  print.step("Opening Firebase Console...");
  await openUrl("https://console.firebase.google.com/");

  console.log("\n📋 In the Firebase Console, please:");
  console.log("   1. Select your project (or create a new one)");
  console.log("   2. Note down your project ID");
  console.log("   3. If you don't have a project, create one now");
  await question("\nPress Enter when you've completed this step...");

  print.step("Get Firebase Configuration");
  console.log("\n📋 To get your Firebase configuration:");
  console.log("   1. In Firebase Console, go to Project Settings (gear icon)");
  console.log("   2. Scroll down to 'Your apps' section");
  console.log(
    "   3. If no web app exists, click 'Add app' and choose web (</>) icon"
  );
  console.log("   4. Register your app with name 'düpp E-Commerce'");
  console.log("   5. Copy the firebaseConfig object values");
  await question("\nPress Enter when you've completed this step...");

  print.step("Update .env file");
  console.log(
    "\n📝 Please update your .env file with the Firebase configuration:"
  );
  console.log("\nReplace these values in .env:");
  console.log("VITE_FIREBASE_API_KEY=your_actual_api_key");
  console.log("VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com");
  console.log("VITE_FIREBASE_PROJECT_ID=your_actual_project_id");
  console.log("VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com");
  console.log("VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id");
  console.log("VITE_FIREBASE_APP_ID=your_app_id");
  await question("\nPress Enter when you've updated the .env file...");

  print.step("Enable Firebase Authentication");
  console.log("\n📋 In Firebase Console:");
  console.log("   1. Click 'Authentication' in the left sidebar");
  console.log("   2. Click 'Get started' if you see it");
  console.log("   3. Go to 'Sign-in method' tab");
  await question("\nPress Enter when you've completed this step...");

  print.step("Enable Google Sign-in Provider");
  console.log("\n📋 In the Sign-in method tab:");
  console.log("   1. Find 'Google' in the providers list");
  console.log("   2. Click on 'Google'");
  console.log("   3. Toggle the 'Enable' switch to ON");
  console.log("   4. Add 'düpp E-Commerce' as Project public-facing name");
  console.log("   5. Add your email as Project support email");
  console.log("   6. Click 'Save'");
  await question("\nPress Enter when you've completed this step...");

  print.step("Configure Authorized Domains");
  console.log("\n📋 Still in Authentication section:");
  console.log("   1. Go to 'Settings' tab");
  console.log("   2. Scroll down to 'Authorized domains'");
  console.log("   3. Make sure 'localhost' is in the list");
  console.log("   4. If not, click 'Add domain' and add 'localhost'");
  await question("\nPress Enter when you've completed this step...");

  print.step("Create Firestore Database");
  console.log("\n📋 Create Firestore Database:");
  console.log("   1. In Firebase Console, click 'Firestore Database'");
  console.log("   2. Click 'Create database'");
  console.log("   3. Choose 'Start in test mode' for now");
  console.log("   4. Select a location (choose closest to your users)");
  console.log("   5. Click 'Done'");
  await question("\nPress Enter when you've completed this step...");

  print.step("Test Google Authentication");
  console.log("\n🚀 Let's test your Google authentication setup!");

  // Start development server
  print.info("Starting development server...");

  try {
    execSync("npm run dev &", { stdio: "ignore" });
    print.success("Development server started");
  } catch (error) {
    print.warning(
      "Could not start dev server automatically. Please run: npm run dev"
    );
  }

  setTimeout(async () => {
    console.log("\n📱 Your app should now be running at:");
    console.log("   👉 http://localhost:5173/d-pp/");
    console.log("\n🧪 Test Google Authentication:");
    console.log("   1. Go to: http://localhost:5173/d-pp/login");
    console.log("   2. Click 'Sign in with Google' button");
    console.log("   3. Complete Google OAuth flow");
    console.log("   4. You should be logged in and redirected");

    const openApp = await question(
      "\nOpen the app in your browser automatically? (y/n): "
    );
    if (openApp.toLowerCase() === "y") {
      await openUrl("http://localhost:5173/d-pp/login");
    }

    print.success("Google Authentication setup complete! 🎉");
    console.log("\n📚 Troubleshooting:");
    console.log(
      "   • If Google button doesn't work, check browser console for errors"
    );
    console.log("   • Make sure popup blockers are disabled for localhost");
    console.log("   • Verify all Firebase configuration values are correct");
    console.log(
      "   • Check that Google provider is enabled in Firebase Console"
    );

    rl.close();
  }, 1000);
}

setupGoogleAuth().catch(console.error);
