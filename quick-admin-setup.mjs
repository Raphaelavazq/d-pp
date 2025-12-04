#!/usr/bin/env node
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import * as readline from "readline";

// Load environment variables
const firebaseConfig = {
  apiKey: "AIzaSyCmcCfsaYrZJPNMeHKA8vIqkgHWKGWvVCk",
  authDomain: "dupp-af67a.firebaseapp.com",
  projectId: "dupp-af67a",
  storageBucket: "dupp-af67a.firebasestorage.app",
  messagingSenderId: "176720932667",
  appId: "1:176720932667:web:f5d7395a4499facfe3911e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
  console.log("\n🔐 düpp Admin User Creator\n");
  console.log("This will create a new admin user in Firebase.\n");

  try {
    const email = await question("Enter admin email: ");
    const password = await question("Enter admin password (min 6 chars): ");
    const displayName = await question("Enter admin display name: ");

    console.log("\n⏳ Creating admin user...\n");

    // Create user in Firebase Auth
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("✅ User created in Firebase Auth");

    // Create admin profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName || "Admin",
      role: "admin",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✅ Admin profile created in Firestore");

    console.log("\n🎉 Admin user created successfully!\n");
    console.log(`Email: ${email}`);
    console.log(`Role: admin`);
    console.log("\nYou can now log in at: http://localhost:5173/admin\n");

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.code === "auth/email-already-in-use") {
      console.log(
        "\n💡 This email is already registered. Try logging in or use a different email.\n"
      );
    }
    rl.close();
    process.exit(1);
  }
}

createAdmin();
