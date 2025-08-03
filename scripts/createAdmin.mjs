// Secure Admin User Creation Script
// Run with: node scripts/createAdmin.mjs
// This script is for development only - remove before production

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  connectAuthEmulator,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read environment variables from .env file
function loadEnvVars() {
  try {
    const envPath = join(__dirname, "../.env");
    const envContent = readFileSync(envPath, "utf8");
    const envVars = {};

    envContent.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) {
        envVars[key.trim()] = value.trim().replace(/["']/g, "");
      }
    });

    return envVars;
  } catch (error) {
    console.error(
      "❌ Could not load .env file. Make sure .env exists in project root."
    );
    process.exit(1);
  }
}

async function createSecureAdminUser() {
  try {
    console.log("🔐 Secure Admin User Creation Script");
    console.log("=====================================");

    const env = loadEnvVars();

    // Validate required environment variables
    const requiredVars = [
      "VITE_FIREBASE_API_KEY",
      "VITE_FIREBASE_AUTH_DOMAIN",
      "VITE_FIREBASE_PROJECT_ID",
      "VITE_FIREBASE_STORAGE_BUCKET",
      "VITE_FIREBASE_MESSAGING_SENDER_ID",
      "VITE_FIREBASE_APP_ID",
    ];

    for (const varName of requiredVars) {
      if (!env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
      }
    }

    // Firebase configuration from environment
    const firebaseConfig = {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: env.VITE_FIREBASE_APP_ID,
      measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Connect to emulators if in development
    if (env.VITE_USE_FIREBASE_EMULATOR === "true") {
      console.log("🔧 Connecting to Firebase emulators...");
      connectAuthEmulator(auth, "http://localhost:9099");
      connectFirestoreEmulator(db, "localhost", 8080);
    }

    // Prompt for admin credentials securely
    const email = process.argv[2] || env.ADMIN_EMAIL || "admin@dupp.com";
    const password = process.argv[3] || env.ADMIN_PASSWORD;

    if (!password || password.length < 8) {
      throw new Error(
        "Password must be at least 8 characters long. Pass as argument: node scripts/createAdmin.mjs email@domain.com SecurePassword123!"
      );
    }

    console.log(`📧 Creating admin user: ${email}`);

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("✅ Admin user created in Firebase Auth");

    // Create secure user profile in Firestore
    const adminProfile = {
      uid: user.uid,
      email: user.email,
      displayName: "System Administrator",
      role: "admin",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: {
        products: true,
        orders: true,
        users: true,
        analytics: true,
        settings: true,
      },
      security: {
        lastLogin: null,
        loginAttempts: 0,
        passwordChanged: new Date(),
        mfaEnabled: false,
      },
      preferences: {
        emailNotifications: true,
        pushNotifications: false,
        language: "en",
        currency: "EUR",
        timezone: "Europe/Berlin",
      },
    };

    await setDoc(doc(db, "users", user.uid), adminProfile);

    console.log("✅ Admin profile created in Firestore");
    console.log("📋 Admin Details:");
    console.log(`   📧 Email: ${email}`);
    console.log(`   🆔 UID: ${user.uid}`);
    console.log(`   🔐 Role: admin`);
    console.log("");
    console.log("🚀 Admin user created successfully!");
    console.log("⚠️  IMPORTANT SECURITY NOTES:");
    console.log("   1. Change the password after first login");
    console.log("   2. Enable MFA for additional security");
    console.log("   3. This script should be removed before production");
    console.log("   4. Monitor admin access in Firebase Console");
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);

    if (error.code === "auth/email-already-in-use") {
      console.log(
        "ℹ️  User already exists. Update role manually in Firestore:"
      );
      console.log("   1. Go to Firestore Console");
      console.log("   2. Find users collection");
      console.log('   3. Update role field to "admin"');
    }

    process.exit(1);
  }
}

// Run the script
createSecureAdminUser()
  .then(() => {
    console.log("✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  });
