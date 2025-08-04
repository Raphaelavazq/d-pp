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
exports.validateAdminAccess = validateAdminAccess;
exports.logAdminAction = logAdminAction;
exports.validateRole = validateRole;
exports.validatePremiumAccess = validatePremiumAccess;
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
/**
 * Centralized admin access validation for all secure functions
 * @param auth - Firebase auth context
 * @throws Error if not admin
 */
async function validateAdminAccess(auth) {
    if (!auth) {
        throw new Error("Authentication required");
    }
    const uid = auth.uid;
    // Get user document to check role
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
        throw new Error("User not found");
    }
    const userData = userDoc.data();
    if (!userData || userData.role !== "admin") {
        throw new Error("Admin access required");
    }
}
/**
 * Log admin actions for audit trail
 * @param adminUid - Admin user ID
 * @param action - Action performed
 * @param details - Additional details
 */
async function logAdminAction(adminUid, action, details = {}) {
    try {
        if (!adminUid)
            return;
        await db.collection("admin_audit_log").add({
            adminUid,
            action,
            details,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            ip: details.ip || "unknown",
            userAgent: details.userAgent || "unknown",
        });
    }
    catch (error) {
        console.error("Error logging admin action:", error);
        // Don't throw here to avoid breaking the main function
    }
}
/**
 * Check if user has specific role
 * @param auth - Firebase auth context
 * @param requiredRole - Required role
 * @throws Error if user doesn't have required role
 */
async function validateRole(auth, requiredRole) {
    if (!auth) {
        throw new Error("Authentication required");
    }
    const uid = auth.uid;
    // Get user document to check role
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
        throw new Error("User not found");
    }
    const userData = userDoc.data();
    if (!userData || userData.role !== requiredRole) {
        throw new Error(`${requiredRole} access required`);
    }
}
/**
 * Check if user is premium or admin
 * @param auth - Firebase auth context
 * @throws Error if user doesn't have premium access
 */
async function validatePremiumAccess(auth) {
    if (!auth) {
        throw new Error("Authentication required");
    }
    const uid = auth.uid;
    // Get user document to check role
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
        throw new Error("User not found");
    }
    const userData = userDoc.data();
    if (!userData || (userData.role !== "premium" && userData.role !== "admin")) {
        throw new Error("Premium access required");
    }
}
//# sourceMappingURL=adminValidation.js.map