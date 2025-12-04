# 🔧 Fix Admin Access - Create User Profile in Firebase

## ⚠️ Problem

Your admin account exists in Firebase Auth, but the Firestore user profile document doesn't exist, causing "Missing or insufficient permissions" errors.

## ✅ Solution

Create the user document manually in Firebase Console:

### Step 1: Open Firebase Console

1. Go to: https://console.firebase.google.com/
2. Select project: **dupp-af67a**
3. Click **Firestore Database** in the left sidebar

### Step 2: Create User Document

1. Click **Start collection** (if empty) or browse to the `users` collection
2. Click **Add document**
3. Set **Document ID**: `6ZmbVBObc3XAeoRjzzWExUEHH3Z2`
   _(This is your user UID from the script output)_

4. Add these fields (click **Add field** for each):

```
Field Name: uid
Type: string
Value: 6ZmbVBObc3XAeoRjzzWExUEHH3Z2

Field Name: email
Type: string
Value: connectwithdupp@gmail.com

Field Name: displayName
Type: string
Value: Admin User

Field Name: firstName
Type: string
Value: Admin

Field Name: lastName
Type: string
Value: User

Field Name: role
Type: string
Value: admin
👆 THIS IS THE MOST IMPORTANT FIELD!

Field Name: status
Type: string
Value: active

Field Name: createdAt
Type: timestamp
Value: (click "Set to current time")

Field Name: updatedAt
Type: timestamp
Value: (click "Set to current time")
```

5. Click **Save**

### Step 3: Login!

1. Go to: http://localhost:5173/admin
2. Login with:
   - **Email**: connectwithdupp@gmail.com
   - **Password**: admin2025

## 🎯 Alternative: Temporarily Relax Security Rules

If you want to fix this in code, you can temporarily update your Firestore rules:

### Open: `firestore.rules`

Replace the users section with:

```javascript
// Users collection - TEMPORARY: Allow creation during setup
match /users/{userId} {
  // Allow users to create their own profile
  allow create: if request.auth != null && request.auth.uid == userId;
  // Allow users to read/update their own profile
  allow read, update: if request.auth != null && request.auth.uid == userId;
  // Allow admins to read all profiles
  allow read: if request.auth != null &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

Then deploy the rules:

```bash
firebase deploy --only firestore:rules
```

Then run the script again:

```bash
node create-admin-quick.mjs
```

Then revert the rules back to the secure version!

## 🚀 What Happens Next

Once the user document exists with `role: "admin"`:

- ✅ Login will work
- ✅ Profile fetching will work
- ✅ Admin dashboard access granted
- ✅ All CRUD operations enabled

## 📞 Need Help?

If you're still having issues:

1. Check Firebase Console → Authentication → Users (user should exist)
2. Check Firebase Console → Firestore → users collection (document should exist)
3. Verify the `role` field is set to `"admin"` (lowercase)
4. Check browser console for specific error messages
