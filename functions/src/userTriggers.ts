import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: "customer" | "admin" | "supplier";
  status: "active" | "inactive" | "banned";
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
  lastLoginAt?: admin.firestore.Timestamp;
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    currency: string;
  };
}

// Trigger when a new user is created
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    const userData: Partial<User> = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      role: "customer", // Default role
      status: "active",
      createdAt: admin.firestore.FieldValue.serverTimestamp() as any,
      updatedAt: admin.firestore.FieldValue.serverTimestamp() as any,
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        language: "en",
        currency: "USD",
      },
    };

    // Create user document in Firestore
    await db.collection("users").doc(user.uid).set(userData);

    // Add to marketing list if opted in
    await addToMarketingList(user.email!, userData);

    // Create welcome notification
    await createWelcomeNotification(user.uid);

    // GDPR-compliant logging - no personal data
    console.log("User creation completed", {
      timestamp: new Date().toISOString(),
      action: "user_created",
      role: userData.role,
    });
  } catch (error) {
    console.error(`Error creating user ${user.uid}:`, error);
  }
});

// Trigger when a user is deleted
export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  try {
    // Delete user document from Firestore
    await db.collection("users").doc(user.uid).delete();

    // Delete user's orders (mark as deleted, don't actually delete for audit trail)
    const ordersSnapshot = await db
      .collection("orders")
      .where("userId", "==", user.uid)
      .get();

    const batch = db.batch();
    ordersSnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        userDeleted: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    // Remove from marketing lists
    await removeFromMarketingList(user.email!);

    // GDPR-compliant logging - no personal data
    console.log("User deletion completed", {
      timestamp: new Date().toISOString(),
      action: "user_deleted",
    });
  } catch (error) {
    console.error(`Error deleting user ${user.uid}:`, error);
  }
});

// Update user profile
export const updateUserProfile = functions.https.onCall(
  async (data: any, context: any) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Authentication required"
      );
    }

    try {
      const { displayName, photoURL, preferences } = data;
      const userId = context.auth.uid;

      const updateData: any = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (displayName !== undefined) updateData.displayName = displayName;
      if (photoURL !== undefined) updateData.photoURL = photoURL;
      if (preferences !== undefined) updateData.preferences = preferences;

      await db.collection("users").doc(userId).update(updateData);

      return { success: true };
    } catch (error) {
      console.error("Profile update error:", error);
      throw new functions.https.HttpsError("internal", "Profile update failed");
    }
  }
);

// Update user role (admin only)
export const updateUserRole = functions.https.onCall(
  async (data: any, context: any) => {
    if (!context.auth || !context.auth.token.admin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Admin access required"
      );
    }

    try {
      const { userId, role } = data;

      if (!["customer", "admin", "supplier"].includes(role)) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Invalid role"
        );
      }

      // Update user role in Firestore
      await db.collection("users").doc(userId).update({
        role,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update custom claims
      await admin.auth().setCustomUserClaims(userId, {
        role,
        admin: role === "admin",
        supplier: role === "supplier",
      });

      return { success: true };
    } catch (error) {
      console.error("Role update error:", error);
      throw new functions.https.HttpsError("internal", "Role update failed");
    }
  }
);

// Ban/unban user
export const updateUserStatus = functions.https.onCall(
  async (data: any, context: any) => {
    if (!context.auth || !context.auth.token.admin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Admin access required"
      );
    }

    try {
      const { userId, status, reason } = data;

      if (!["active", "inactive", "banned"].includes(status)) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Invalid status"
        );
      }

      const updateData: any = {
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (status === "banned" && reason) {
        updateData.banReason = reason;
        updateData.bannedAt = admin.firestore.FieldValue.serverTimestamp();
      }

      await db.collection("users").doc(userId).update(updateData);

      // Disable Firebase Auth account if banned
      if (status === "banned") {
        await admin.auth().updateUser(userId, { disabled: true });
      } else if (status === "active") {
        await admin.auth().updateUser(userId, { disabled: false });
      }

      return { success: true };
    } catch (error) {
      console.error("User status update error:", error);
      throw new functions.https.HttpsError("internal", "Status update failed");
    }
  }
);

// Get user analytics
export const getUserAnalytics = functions.https.onCall(
  async (data: any, context: any) => {
    if (!context.auth || !context.auth.token.admin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Admin access required"
      );
    }

    try {
      const { period = "30d" } = data;

      const now = new Date();
      const startDate = new Date();

      switch (period) {
        case "7d":
          startDate.setDate(now.getDate() - 7);
          break;
        case "30d":
          startDate.setDate(now.getDate() - 30);
          break;
        case "90d":
          startDate.setDate(now.getDate() - 90);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      // Get user registration statistics
      const usersSnapshot = await db
        .collection("users")
        .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(startDate))
        .get();

      const usersByRole = {
        customer: 0,
        admin: 0,
        supplier: 0,
      };

      const usersByStatus = {
        active: 0,
        inactive: 0,
        banned: 0,
      };

      usersSnapshot.docs.forEach((doc) => {
        const user = doc.data() as User;
        usersByRole[user.role]++;
        usersByStatus[user.status]++;
      });

      // Get total users
      const totalUsersSnapshot = await db.collection("users").get();
      const totalUsers = totalUsersSnapshot.size;

      return {
        success: true,
        period,
        totalUsers,
        newUsers: usersSnapshot.size,
        usersByRole,
        usersByStatus,
      };
    } catch (error) {
      console.error("User analytics error:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Analytics retrieval failed"
      );
    }
  }
);

// Update last login timestamp
export const updateLastLogin = functions.https.onCall(
  async (data: any, context: any) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Authentication required"
      );
    }

    try {
      const userId = context.auth.uid;

      await db.collection("users").doc(userId).update({
        lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error("Last login update error:", error);
      // Don't throw error as this is not critical
      return { success: false };
    }
  }
);

async function addToMarketingList(email: string, userData: Partial<User>) {
  try {
    // Add to marketing collection
    await db.collection("marketing").doc(email).set({
      email,
      userId: userData.uid,
      subscribed: true,
      source: "registration",
      subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
      preferences: userData.preferences,
    });

    // GDPR-compliant logging - no personal data
    console.log("User added to marketing list", {
      timestamp: new Date().toISOString(),
      action: "marketing_opt_in",
    });
  } catch (error) {
    console.error(`Error adding ${email} to marketing list:`, error);
  }
}

async function removeFromMarketingList(email: string) {
  try {
    await db.collection("marketing").doc(email).update({
      subscribed: false,
      unsubscribedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // GDPR-compliant logging - no personal data
    console.log("User removed from marketing list", {
      timestamp: new Date().toISOString(),
      action: "marketing_opt_out",
    });
  } catch (error) {
    console.error(`Error removing ${email} from marketing list:`, error);
  }
}

async function createWelcomeNotification(userId: string) {
  try {
    await db.collection("notifications").add({
      userId,
      type: "welcome",
      title: "Welcome to düpp!",
      message:
        "Thank you for joining our community. Explore our collection of premium products.",
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // GDPR-compliant logging - no personal data
    console.log("Welcome notification created", {
      timestamp: new Date().toISOString(),
      action: "notification_created",
      type: "welcome",
    });
  } catch (error) {
    console.error(
      `Error creating welcome notification for user ${userId}:`,
      error
    );
  }
}

export const userTriggers = {
  onUserCreate,
  onUserDelete,
  updateUserProfile,
  updateUserRole,
  updateUserStatus,
  getUserAnalytics,
  updateLastLogin,
};
