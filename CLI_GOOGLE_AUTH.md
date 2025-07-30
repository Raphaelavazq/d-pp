# 🚀 Command Line Google Authentication Setup

## ⚡ **One-Command Setup (Easiest)**

Run this single command to set up Google authentication:

```bash
npm run setup:google
```

This will give you 3 options:

1. **Interactive GUI setup** (opens Firebase Console)
2. **Firebase CLI setup** (automated with CLI)
3. **Manual instructions** (step-by-step guide)

## 🎯 **Alternative Commands**

### **Interactive Setup (Recommended)**

```bash
npm run setup:google-interactive
# OR
./setup-google-auth.sh
```

- Opens Firebase Console in browser
- Step-by-step guided process
- Most user-friendly option

### **Firebase CLI Setup (Advanced)**

```bash
npm run setup:google-cli
# OR
./firebase-cli-setup.sh
```

- Uses Firebase CLI for automation
- Requires Firebase CLI installed
- Faster for experienced users

### **Quick Manual Check**

```bash
./check-google-auth.sh
```

- Verifies current setup status
- Shows what's missing
- Quick diagnostics

## 📋 **What These Commands Do**

### **setup-google-auth.sh**:

✅ Checks prerequisites
✅ Opens Firebase Console
✅ Guides through each step
✅ Updates .env file
✅ Tests the setup
✅ Opens app in browser

### **firebase-cli-setup.sh**:

✅ Installs Firebase CLI if needed
✅ Logs into Firebase
✅ Lists available projects
✅ Gets Firebase configuration
✅ Updates .env automatically
✅ Shows remaining manual steps

### **quick-google-setup.sh**:

✅ Menu to choose setup method
✅ Runs appropriate script
✅ Simplest entry point

## 🔧 **Manual Setup Commands**

If you prefer to do it manually:

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. List projects
firebase projects:list

# 4. Use your project
firebase use your-project-id

# 5. Get config
firebase apps:sdkconfig web

# 6. Start your app
npm run dev
```

## 🎯 **After Running Any Setup**

1. **Enable Google provider** in Firebase Console
2. **Add localhost** to authorized domains
3. **Enable Firestore** database
4. **Test the setup**:
   ```bash
   npm run dev
   ```
5. **Visit**: `http://localhost:5173/d-pp/login`
6. **Click**: "Sign in with Google" button

## ✅ **Verify Setup**

Check if everything is working:

```bash
./check-google-auth.sh
```

This shows:

- ✅ Firebase config status
- ✅ Environment variables
- ✅ Authentication pages
- ✅ Google auth implementation
- ✅ Next steps needed

## 🚀 **Quick Start**

**Fastest way to get Google auth working:**

```bash
# Run the setup
npm run setup:google

# Choose option 1 (Interactive)
# Follow the guided steps
# Test at http://localhost:5173/d-pp/login
```

## 🔍 **Troubleshooting Commands**

```bash
# Check setup status
./check-google-auth.sh

# Check Firebase CLI status
firebase projects:list

# Check if app is running
lsof -i :5173

# View logs
npm run dev

# Check environment
cat .env
```

## 📁 **Files Created**

- `setup-google-auth.sh` - Interactive setup script
- `firebase-cli-setup.sh` - CLI automation script
- `quick-google-setup.sh` - Menu-driven setup
- `check-google-auth.sh` - Status checker
- `GOOGLE_AUTH_SETUP.md` - Detailed guide

## 🎉 **That's It!**

Your Google authentication is now ready to use via command line!

**The easiest way**: Just run `npm run setup:google` and follow the prompts! 🚀
