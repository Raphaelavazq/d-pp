#!/usr/bin/env node

/**
 * SECURE Admin User Creation Script
 * Usage: node scripts/createAdmin.js
 *
 * This script creates an admin user securely using environment variables.
 * It should only be run in development/staging environments.
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { randomBytes } from "crypto";

// Validate environment variables
const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error(
    "\n💡 Please ensure your .env file contains all required Firebase configuration."
  );
  process.exit(1);
}

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Generate a secure random password
 */
function generateSecurePassword(length = 16) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  const randomBytesArray = randomBytes(length);
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars[randomBytesArray[i] % chars.length];
  }

  return password;
}

/**
 * Create admin user securely
 */
async function createAdminUser() {
  try {
    // Get admin credentials from environment or prompt for secure input
    const adminEmail = process.env.ADMIN_EMAIL || "admin@dupp.com";
    const adminPassword =
      process.env.ADMIN_PASSWORD || generateSecurePassword();

    console.log("🔄 Creating admin user...");
    console.log(`📧 Email: ${adminEmail}`);

    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      adminEmail,
      adminPassword
    );
    const user = userCredential.user;

    console.log("✅ User created in Firebase Auth");

    // Create the user profile in Firestore with admin role
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: "Admin User",
      firstName: "Admin",
      lastName: "User",
      role: "admin", // Critical: This grants admin access
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "system-script",
      lastLogin: null,
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        language: "en",
        currency: "USD",
        darkMode: false,
      },
      security: {
        mfaEnabled: false,
        lastPasswordChange: new Date(),
        loginAttempts: 0,
        lockedUntil: null,
      },
    };

    await setDoc(doc(db, "users", user.uid), userProfile);

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", adminEmail);

    // Only show password if it was generated (not from env)
    if (!process.env.ADMIN_PASSWORD) {
      console.log("🔑 Generated Password:", adminPassword);
      console.log("⚠️  IMPORTANT: Save this password securely!");
    }

    console.log("🚀 You can now login at /admin");
    console.log("");
    console.log("🔒 Security Reminders:");
    console.log("1. Change the password after first login");
    console.log("2. Enable MFA for the admin account");
    console.log("3. Use a strong, unique password");
    console.log("4. Never share admin credentials");
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);

    if (error.code === "auth/email-already-in-use") {
      console.log(
        "ℹ️  User already exists. You can manually update their role in Firestore:"
      );
      console.log("   1. Go to Firestore Console");
      console.log("   2. Find the user document");
      console.log('   3. Set role field to "admin"');
    }

    process.exit(1);
  }
}

// Validate this is not production
if (process.env.NODE_ENV === "production") {
  console.error("❌ This script should not be run in production!");
  console.error(
    "💡 Create admin users through secure administrative processes in production."
  );
  process.exit(1);
}

createAdminUser()
  .then(() => {
    console.log("✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  });
