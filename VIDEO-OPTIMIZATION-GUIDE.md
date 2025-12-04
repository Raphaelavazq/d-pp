# Video Optimization Implementation Guide

## Step 1: Upload Videos to Firebase Storage

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/project/dupp-af67a/storage
   - Click "Get Started" if not enabled

2. **Create Folder Structure:**
   ```
   dupp-af67a.appspot.com/
   ├── videos/
   │   ├── hero/
   │   │   └── heroVideo.mp4
   │   ├── about/
   │   │   ├── about.mp4
   │   │   └── about3.mp4
   │   ├── impact/
   │   │   ├── impact1.mp4
   │   │   ├── impact2.mp4
   │   │   ├── impact3.mp4
   │   │   ├── impact4.mp4
   │   │   └── impact5.mp4
   │   └── shop/
   │       ├── shop1.mp4
   │       └── shop_banner.mp4
   ```

3. **Upload Files:**
   - Drag and drop all videos from `src/assets/` to appropriate folders
   - Make them public: Right-click → "Get download URL"
   - Copy all URLs

4. **Update Storage Rules:**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /videos/{allPaths=**} {
         allow read: if true; // Public read access
         allow write: if request.auth != null; // Only authenticated users can upload
       }
     }
   }
   ```

## Step 2: Create Video Configuration File

Create `src/config/videoUrls.js` with all your Firebase Storage URLs:

```javascript
export const videoUrls = {
  hero: 'https://firebasestorage.googleapis.com/v0/b/dupp-af67a.appspot.com/o/videos%2Fhero%2FheroVideo.mp4?alt=media',
  about: 'https://firebasestorage.googleapis.com/v0/b/dupp-af67a.appspot.com/o/videos%2Fabout%2Fabout.mp4?alt=media',
  // ... add all video URLs
};
```

## Step 3: Update Component Imports

Replace all video imports with configuration:

```javascript
// Before:
import heroVideo from "../assets/heroVideo.mp4";

// After:
import { videoUrls } from "../config/videoUrls";
const heroVideo = videoUrls.hero;
```

## Alternative: Quick Fix with Compression

If you want a quick fix without Firebase Storage:

```bash
# Install ffmpeg (macOS)
brew install ffmpeg

# Compress all videos
cd src/assets
for file in *.mp4; do
  ffmpeg -i "$file" -vcodec h264 -crf 28 -preset slow "${file%.mp4}_compressed.mp4"
done
```

This will reduce file sizes by ~80% while maintaining good quality.
