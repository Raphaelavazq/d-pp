import * as admin from "firebase-admin";

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
export async function validateAdminAccess(auth: any): Promise<void> {
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
export async function logAdminAction(
  adminUid: string | undefined,
  action: string,
  details: any = {}
): Promise<void> {
  try {
    if (!adminUid) return;

    await db.collection("admin_audit_log").add({
      adminUid,
      action,
      details,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ip: details.ip || "unknown",
      userAgent: details.userAgent || "unknown",
    });
  } catch (error) {
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
export async function validateRole(
  auth: any,
  requiredRole: string
): Promise<void> {
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
export async function validatePremiumAccess(auth: any): Promise<void> {
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
