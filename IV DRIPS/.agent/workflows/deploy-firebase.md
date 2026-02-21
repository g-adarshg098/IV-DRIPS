---
description: Deploy IV Drips Monitor to Firebase
---

# Deploy to Firebase Hosting (Recommended)

This workflow deploys your IV Drip Monitoring System to Firebase Hosting with Cloud Functions.

## Prerequisites

- Firebase project created
- Firebase CLI installed globally
- Firebase Authentication enabled with Google provider

## Steps

### 1. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase in your project

```bash
cd "d:\IV DRIPS"
firebase init
```

**Configuration:**
- Select: Hosting, Functions (optional)
- Use existing project: Select your Firebase project
- Public directory: `iv-monitor-client/build`
- Single-page app: Yes
- Automatic builds: No

### 4. Update Firebase configuration

Make sure your `iv-monitor-client/.env` has the correct Firebase credentials:

```env
REACT_APP_FIREBASE_API_KEY=your_actual_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 5. Build the React app for production

// turbo
```bash
cd iv-monitor-client
npm run build
```

### 6. Test the production build locally (optional)

```bash
npx serve -s build
```

Visit `http://localhost:3000` to test.

### 7. Deploy to Firebase Hosting

// turbo
```bash
cd ..
firebase deploy --only hosting
```

### 8. Add your production domain to Firebase Auth

1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add your deployed domain (e.g., `your-project.web.app`)

### 9. Test your deployed application

Visit: `https://YOUR_PROJECT_ID.web.app`

## Backend Deployment Options

### Option A: Keep backend on local/VPS

Update the API URL in your frontend to point to your backend server:

In `iv-monitor-client/src/components/Dashboard.js`:
```javascript
const API_URL = 'https://your-backend-domain.com/api';
```

Then rebuild and redeploy.

### Option B: Deploy backend to Firebase Cloud Functions

1. Initialize Cloud Functions:
```bash
firebase init functions
```

2. Move your server code to `functions/index.js`

3. Deploy functions:
```bash
firebase deploy --only functions
```

4. Update frontend API URL to: `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api`

## Post-Deployment Checklist

- ✅ Test Google login
- ✅ Verify patient data loads
- ✅ Check real-time updates work
- ✅ Test on mobile devices
- ✅ Verify CORS is configured correctly

## Troubleshooting

**Issue: Authentication not working**
- Ensure your domain is added to Firebase Authorized domains

**Issue: API calls failing**
- Check CORS configuration in backend
- Verify API URL is correct in frontend

**Issue: Build fails**
- Run `npm install` in iv-monitor-client
- Check for any console errors
- Ensure all dependencies are installed

## Useful Commands

**Redeploy after changes:**
```bash
cd iv-monitor-client
npm run build
cd ..
firebase deploy --only hosting
```

**View deployment history:**
```bash
firebase hosting:channel:list
```

**Rollback to previous version:**
```bash
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```
