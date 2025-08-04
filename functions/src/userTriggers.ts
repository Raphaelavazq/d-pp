import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: "user" | "admin" | "premium";
  status: "active" | "suspended" | "deleted";
  lastLogin?: Date;
  createdAt: Date;
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
    currency: string;
  };
}

// Create user profile - called from client after user registration
export const onUserCreate = onCall(
  { region: "europe-west1" },
  async (request) => {
    try {
      const { auth } = request;

      if (!auth) {
        throw new Error("Authentication required");
      }

      const userData: Partial<User> = {
        uid: auth.uid,
        email: auth.token.email!,
        displayName: auth.token.name || "",
        photoURL: auth.token.picture || "",
        role: "user",
        status: "active",
        createdAt: new Date(),
        preferences: {
          newsletter: true,
          notifications: true,
          language: "en",
          currency: "EUR",
        },
      };

      // Create user document in Firestore
      await db.collection("users").doc(auth.uid).set(userData);

      // Initialize user's cart
      await db.collection("carts").doc(auth.uid).set({
        items: [],
        total: 0,
        currency: "EUR",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`User profile created for ${auth.token.email} (${auth.uid})`);

      return {
        success: true,
        message: "User profile created successfully",
      };
    } catch (error: any) {
      console.error("Error creating user profile:", error);
      throw new Error(`Failed to create user profile: ${error.message}`);
    }
  }
);

// Update user profile
export const updateUserProfile = onCall(
  { region: "europe-west1" },
  async (request) => {
    if (!request.auth) {
      throw new Error("Authentication required");
    }

    try {
      const { displayName, photoURL, preferences } = request.data;
      const uid = request.auth.uid;

      const updateData: any = {
        updatedAt: new Date(),
      };

      if (displayName !== undefined) updateData.displayName = displayName;
      if (photoURL !== undefined) updateData.photoURL = photoURL;
      if (preferences) updateData.preferences = preferences;

      await db.collection("users").doc(uid).update(updateData);

      return { success: true, message: "Profile updated successfully" };
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw new Error("Profile update failed");
    }
  }
);

// Update user role (admin only)
export const updateUserRole = onCall(
  { region: "europe-west1" },
  async (request) => {
    if (!request.auth) {
      throw new Error("Authentication required");
    }

    try {
      // Check if user is admin
      const adminDoc = await db.collection("users").doc(request.auth.uid).get();
      const adminData = adminDoc.data();

      if (!adminData || adminData.role !== "admin") {
        throw new Error("Admin access required");
      }

      const { targetUserId, newRole } = request.data;

      if (!["user", "admin", "premium"].includes(newRole)) {
        throw new Error("Invalid role specified");
      }

      await db.collection("users").doc(targetUserId).update({
        role: newRole,
        updatedAt: new Date(),
      });

      // Set custom claims for role-based access
      await admin.auth().setCustomUserClaims(targetUserId, { role: newRole });

      console.log(`User role updated: ${targetUserId} -> ${newRole}`);

      return {
        success: true,
        message: `User role updated to ${newRole}`,
      };
    } catch (error) {
      console.error("Error updating user role:", error);
      throw new Error("Role update failed");
    }
  }
);
