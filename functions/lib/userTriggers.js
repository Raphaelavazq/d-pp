"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.updateUserProfile = exports.onUserCreate = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// Create user profile - called from client after user registration
exports.onUserCreate = (0, https_1.onCall)({ region: "europe-west1" }, async (request) => {
    try {
        const { auth } = request;
        if (!auth) {
            throw new Error("Authentication required");
        }
        const userData = {
            uid: auth.uid,
            email: auth.token.email,
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
    }
    catch (error) {
        console.error("Error creating user profile:", error);
        throw new Error(`Failed to create user profile: ${error.message}`);
    }
});
// Update user profile
exports.updateUserProfile = (0, https_1.onCall)({ region: "europe-west1" }, async (request) => {
    if (!request.auth) {
        throw new Error("Authentication required");
    }
    try {
        const { displayName, photoURL, preferences } = request.data;
        const uid = request.auth.uid;
        const updateData = {
            updatedAt: new Date(),
        };
        if (displayName !== undefined)
            updateData.displayName = displayName;
        if (photoURL !== undefined)
            updateData.photoURL = photoURL;
        if (preferences)
            updateData.preferences = preferences;
        await db.collection("users").doc(uid).update(updateData);
        return { success: true, message: "Profile updated successfully" };
    }
    catch (error) {
        console.error("Error updating user profile:", error);
        throw new Error("Profile update failed");
    }
});
// Update user role (admin only)
exports.updateUserRole = (0, https_1.onCall)({ region: "europe-west1" }, async (request) => {
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
    }
    catch (error) {
        console.error("Error updating user role:", error);
        throw new Error("Role update failed");
    }
});
//# sourceMappingURL=userTriggers.js.map