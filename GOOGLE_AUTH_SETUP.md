# 🔑 Complete Google Sign-Up/Sign-In Setup Guide

## ✅ **Current Status: Google Auth is Already Implemented!**

Your app already has Google authentication built-in. Here's how to enable and use it:

## 🔧 **Step 1: Firebase Console Setup**

### **Enable Google Authentication:**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project** (or create one)
3. **Navigate to Authentication**:
   - Click "Authentication" in left sidebar
   - Click "Sign-in method" tab
4. **Enable Google Provider**:
   - Click on "Google" in the providers list
   - Toggle "Enable" switch to ON
   - Add your **Project Public-facing name** (e.g., "düpp E-Commerce")
   - Add **Support email** (your email)
   - Click "Save"

## 🌐 **Step 2: Configure OAuth Consent Screen**

### **For Development (localhost):**

1. In Firebase Console → Authentication → Settings
2. Add authorized domains:
   - `localhost:5173`
   - `localhost:5174`
   - Your production domain when ready

### **For Production:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to "APIs & Services" → "OAuth consent screen"
4. Configure your app details (name, logo, privacy policy, etc.)

## 🎯 **Step 3: Test Google Authentication**

### **How to Use Google Sign-In:**

1. **Start your app**: `npm run dev`
2. **Go to Login page**: `http://localhost:5173/d-pp/login`
3. **Click "Sign in with Google"** button
4. **Complete Google OAuth flow**
5. **User automatically redirected and logged in**

### **How to Use Google Sign-Up:**

1. **Go to Signup page**: `http://localhost:5173/d-pp/signup`
2. **Click "Sign up with Google"** button
3. **Complete Google OAuth flow**
4. **User profile automatically created in Firestore**

## 🔍 **What Happens During Google Auth:**

### **For New Users (Sign-Up):**

✅ User authenticates with Google
✅ Firebase creates user account
✅ App creates user profile in Firestore with:

- Name from Google account
- Email from Google account
- Profile photo from Google account
- Default preferences
- Customer role

### **For Existing Users (Sign-In):**

✅ User authenticates with Google
✅ App loads existing user profile from Firestore
✅ User logged in and redirected

## 🎨 **Google Button Already Implemented**

Your app already has Google sign-in buttons with:

- ✅ **Google logo and styling**
- ✅ **"Sign in with Google" text**
- ✅ **Loading states**
- ✅ **Error handling**
- ✅ **Responsive design**

## 📱 **Available in Both Pages:**

### **Login Page** (`/login`):

- Email/password form
- **"Sign in with Google" button**
- Forgot password link

### **Signup Page** (`/signup`):

- Registration form
- **"Sign up with Google" button**
- Terms and conditions

## 🛠️ **Testing Checklist:**

- [ ] Firebase project has Google auth enabled
- [ ] localhost domains added to authorized domains
- [ ] App is running on correct port
- [ ] Click Google button and complete OAuth flow
- [ ] Check user appears in Firebase Authentication console
- [ ] Check user profile created in Firestore
- [ ] Test logout and sign back in
- [ ] Verify user menu appears in navbar

## 🔧 **Troubleshooting:**

### **"Popup Blocked" Error:**

- Allow popups for localhost in browser settings
- Or use redirect method instead of popup

### **"Unauthorized Domain" Error:**

- Add your domain to Firebase authorized domains
- For localhost: add `localhost:5173` and `localhost:5174`

### **"OAuth Client Not Found" Error:**

- Make sure Google provider is enabled in Firebase
- Check that Firebase project is properly configured

### **Google Button Not Working:**

- Check browser console for errors
- Verify Firebase config in .env file
- Make sure you're using the correct port

## 🎉 **Ready to Use!**

Your Google authentication is **already fully implemented** and ready to use! Just:

1. **Enable Google provider in Firebase Console**
2. **Add authorized domains for localhost**
3. **Start your app**: `npm run dev`
4. **Test the Google buttons on login/signup pages**

The Google authentication will work seamlessly with your existing authentication system! 🚀

## 📞 **Support:**

If you need help with any step, check:

- Firebase Console errors
- Browser console for JavaScript errors
- Network tab for failed requests
- Firebase Authentication users list to see if accounts are being created
