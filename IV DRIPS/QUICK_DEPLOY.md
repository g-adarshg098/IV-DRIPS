# 🚀 Quick Deployment Reference

## Fastest Path to Production

### Option 1: Firebase (5 minutes) ⭐ RECOMMENDED

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize
cd "d:\IV DRIPS"
firebase init
# Select: Hosting
# Public dir: iv-monitor-client/build
# SPA: Yes

# 4. Build
cd iv-monitor-client
npm run build

# 5. Deploy
cd ..
firebase deploy --only hosting
```

**Result:** `https://YOUR_PROJECT_ID.web.app` ✅

---

### Option 2: Vercel (3 minutes)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Build
cd iv-monitor-client
npm run build

# 3. Deploy
vercel --prod
```

**Result:** `https://iv-drip-monitor.vercel.app` ✅

---

### Option 3: Netlify (3 minutes)

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build
cd iv-monitor-client
npm run build

# 3. Deploy
netlify deploy --prod --dir=build
```

**Result:** `https://iv-drip-monitor.netlify.app` ✅

---

## Backend Deployment

### Option A: Render (Free)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. New Web Service → Connect repo
4. Start command: `node server.js`
5. Deploy

**Result:** `https://your-app.onrender.com` ✅

### Option B: Railway (Free)

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repo
4. Deploy

**Result:** `https://your-app.railway.app` ✅

---

## Environment Variables Checklist

Before deploying, ensure these are set:

```env
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

---

## Post-Deployment

1. ✅ Add domain to Firebase Authorized Domains
2. ✅ Update API URL in frontend (if backend deployed separately)
3. ✅ Test Google login
4. ✅ Verify patient data loads

---

## Need the full guide?

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## Quick Commands

**Rebuild and redeploy:**
```bash
cd iv-monitor-client && npm run build && cd .. && firebase deploy
```

**Check deployment status:**
```bash
firebase hosting:channel:list
```
