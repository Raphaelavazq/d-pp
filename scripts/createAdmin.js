// Script to create an admin user
// Run this with: node scripts/createAdmin.js
// Make sure to set your environment variables first

// Load environment variables
require("dotenv").config();

const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

// Firebase config using environment variables
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

async function createAdminUser() {
  try {
    const email = "admin@dupp.com";
    const password = "DuppAdmin2025!"; // Change this to a secure password

    console.log("🔄 Creating admin user...");

    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
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
      role: "admin", // This is the key field for admin access
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

    await setDoc(doc(db, "users", user.uid), userProfile);

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);
    console.log("🚀 You can now login at http://localhost:5174/admin");
    console.log("");
    console.log("⚠️  Remember to:");
    console.log("1. Change the default password after first login");
    console.log("2. Keep your admin credentials secure");
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);

    if (error.code === "auth/email-already-in-use") {
      console.log(
        "ℹ️  User already exists. You can still set admin role manually in Firestore."
      );
    }
  }
}

createAdminUser()
  .then(() => {
    console.log("✅ Script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  });
