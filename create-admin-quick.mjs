#!/usr/bin/env node

/**
 * Quick Admin Setup - Creates admin user with Firestore profile
 * This ensures the user document exists in Firestore so the security rules work
 */

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Firebase configuration (hardcoded for simplicity)
const firebaseConfig = {
  apiKey: "AIzaSyCmcCfsaYrZJPNMeHKA8vIqkgHWKGWvVCk",
  authDomain: "dupp-af67a.firebaseapp.com",
  projectId: "dupp-af67a",
  storageBucket: "dupp-af67a.firebasestorage.app",
  messagingSenderId: "176720932667",
  appId: "1:176720932667:web:f5d7395a4499facfe3911e",
};

// Admin credentials
const ADMIN_EMAIL = "connectwithdupp@gmail.com";
const ADMIN_PASSWORD = "admin2025";

console.log("\n🔧 Admin User Setup Tool\n");
console.log("=".repeat(50));

async function createAdminUser() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log("\n✅ Firebase initialized");
    console.log(`📧 Creating admin: ${ADMIN_EMAIL}\n`);

    let userId;
    let isNewUser = false;

    // Try to create the user
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        ADMIN_EMAIL,
        ADMIN_PASSWORD
      );
      userId = userCredential.user.uid;
      isNewUser = true;
      console.log("✅ Admin user created in Firebase Auth");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        console.log("⚠️  User already exists in Firebase Auth");
        // Get the existing user's UID by signing in
        const { signInWithEmailAndPassword } = await import("firebase/auth");
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            ADMIN_EMAIL,
            ADMIN_PASSWORD
          );
          userId = userCredential.user.uid;
          console.log("✅ Signed in to get user ID");
        } catch (signInError) {
          console.error("\n❌ Could not sign in with provided credentials");
          console.error("💡 Please reset the password using the reset tool\n");
          process.exit(1);
        }
      } else {
        throw error;
      }
    }

    // Create or update Firestore user profile
    console.log(`\n📝 Creating Firestore profile for UID: ${userId}`);

    const userProfile = {
      uid: userId,
      email: ADMIN_EMAIL,
      displayName: "Admin User",
      firstName: "Admin",
      lastName: "User",
      role: "admin", // ⚡ THIS IS CRITICAL!
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        language: "en",
        currency: "USD",
      },
    };

    await setDoc(doc(db, "users", userId), userProfile, { merge: true });
    console.log("✅ Firestore user profile created/updated");

    // Verify the document was created
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      console.log("\n✅ Verification successful!");
      console.log("📋 User Profile:");
      console.log(`   - UID: ${data.uid}`);
      console.log(`   - Email: ${data.email}`);
      console.log(`   - Role: ${data.role}`);
      console.log(`   - Status: ${data.status}`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 ADMIN SETUP COMPLETE!");
    console.log("=".repeat(50));
    console.log("\n📌 Login credentials:");
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log("\n🚀 Next steps:");
    console.log("   1. Go to: http://localhost:5173/admin");
    console.log("   2. Login with the credentials above");
    console.log("   3. Start managing your store!\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error creating admin user:", error.message);
    console.error("\n💡 Troubleshooting:");
    console.error("   1. Check your .env file has all Firebase credentials");
    console.error("   2. Ensure Firebase project is properly configured");
    console.error("   3. Check Firebase console for any issues\n");
    process.exit(1);
  }
}

createAdminUser();
