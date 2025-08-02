import React, { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { AuthContext } from "./auth-context.js";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, firstName, lastName) => {
    const displayName = `${firstName} ${lastName}`.trim();

    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update display name
    await updateProfile(user, { displayName });

    // Create user profile in Firestore
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName,
      firstName,
      lastName,
      role: "customer",
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
  };

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);

    // Check if user profile exists, if not create one
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        role: "customer",
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
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (data) => {
    if (!currentUser) throw new Error("No user logged in");

    const updatedData = {
      ...data,
      updatedAt: new Date(),
    };

    await setDoc(doc(db, "users", currentUser.uid), updatedData, {
      merge: true,
    });

    // Update local state
    if (userProfile) {
      setUserProfile({ ...userProfile, ...updatedData });
    }
  };

  const fetchUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile({
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    signIn: login,
    signInWithGoogle: loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
