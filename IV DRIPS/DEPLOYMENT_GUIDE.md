# 🚀 IV DRIP MONITORING SYSTEM - DEPLOYMENT GUIDE

This guide covers multiple deployment options for your IV Drip Monitoring System.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Option 1: Firebase Hosting (Recommended)](#option-1-firebase-hosting-recommended)
3. [Option 2: Vercel + Render](#option-2-vercel--render)
4. [Option 3: Netlify + Render](#option-3-netlify--render)
5. [Option 4: Self-Hosted (VPS)](#option-4-self-hosted-vps)
6. [Environment Variables Setup](#environment-variables-setup)
7. [Post-Deployment Testing](#post-deployment-testing)

---

## 🔍 Pre-Deployment Checklist

Before deploying, ensure you have:

- ✅ **Firebase Project** set up with Authentication enabled
- ✅ **Google OAuth** configured in Firebase Console
- ✅ **Environment variables** properly configured
- ✅ **Production build** tested locally
- ✅ **Backend API** endpoints working
- ✅ **CORS** configured for production domains

---

## 🔥 Option 1: Firebase Hosting (Recommended)

Firebase Hosting is ideal since you're already using Firebase for authentication.

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase in Your Project

```bash
cd "d:\IV DRIPS"
firebase init
```

**Select the following options:**
- ✅ Hosting: Configure files for Firebase Hosting
- ✅ Use an existing project (select your Firebase project)
- 📁 Public directory: `iv-monitor-client/build`
- ✅ Configure as single-page app: **Yes**
- ❌ Set up automatic builds with GitHub: **No** (for now)

### Step 4: Build Your React App

```bash
cd iv-monitor-client
npm run build
```

This creates an optimized production build in `iv-monitor-client/build/`.

### Step 5: Deploy Frontend to Firebase

```bash
cd ..
firebase deploy --only hosting
```

Your frontend will be live at: `https://YOUR_PROJECT_ID.web.app`

### Step 6: Deploy Backend (Choose One)

#### Option A: Firebase Cloud Functions (Recommended)

1. **Initialize Cloud Functions:**
```bash
firebase init functions
```

2. **Convert your server to Cloud Functions:**

Create `functions/index.js`:
```javascript
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// Import your existing routes
const patients = require('./data/patients.json');

app.get('/api/patients', (req, res) => {
  res.json(patients);
});

// Add all your other routes here...

exports.api = functions.https.onRequest(app);
```

3. **Deploy Functions:**
```bash
firebase deploy --only functions
```

Your API will be at: `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api`

4. **Update Frontend API URL:**

In `iv-monitor-client/src/components/Dashboard.js`, update the API endpoint:
```javascript
const API_URL = 'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api';
```

#### Option B: Deploy Backend to Render (Free Tier)

See [Option 2](#option-2-vercel--render) below for Render deployment.

---

## 🌐 Option 2: Vercel + Render

Deploy frontend to Vercel and backend to Render.

### Frontend: Vercel

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Build Your React App

```bash
cd iv-monitor-client
npm run build
```

#### Step 3: Deploy to Vercel

```bash
vercel
```

Follow the prompts:
- Set up and deploy: **Yes**
- Scope: Select your account
- Link to existing project: **No**
- Project name: `iv-drip-monitor`
- Directory: `./` (current directory)
- Override settings: **No**

#### Step 4: Set Environment Variables

```bash
vercel env add REACT_APP_FIREBASE_API_KEY
vercel env add REACT_APP_FIREBASE_AUTH_DOMAIN
vercel env add REACT_APP_FIREBASE_PROJECT_ID
vercel env add REACT_APP_FIREBASE_STORAGE_BUCKET
vercel env add REACT_APP_FIREBASE_MESSAGING_SENDER_ID
vercel env add REACT_APP_FIREBASE_APP_ID
```

#### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

Your frontend will be live at: `https://iv-drip-monitor.vercel.app`

### Backend: Render

#### Step 1: Create a GitHub Repository

1. Initialize git in your server folder:
```bash
cd server
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub
3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/iv-drip-backend.git
git push -u origin main
```

#### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign up
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `iv-drip-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

5. Add environment variables if needed

6. Click **Create Web Service**

Your backend will be live at: `https://iv-drip-backend.onrender.com`

#### Step 3: Update Frontend to Use New Backend URL

Update `iv-monitor-client/src/components/Dashboard.js`:
```javascript
const API_URL = 'https://iv-drip-backend.onrender.com/api';
```

Rebuild and redeploy frontend:
```bash
cd iv-monitor-client
npm run build
vercel --prod
```

---

## 🎨 Option 3: Netlify + Render

Similar to Vercel, but using Netlify for frontend.

### Frontend: Netlify

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Build Your React App

```bash
cd iv-monitor-client
npm run build
```

#### Step 3: Deploy to Netlify

```bash
netlify deploy
```

Follow the prompts:
- Create & configure a new site
- Team: Select your team
- Site name: `iv-drip-monitor`
- Publish directory: `build`

#### Step 4: Deploy to Production

```bash
netlify deploy --prod
```

#### Step 5: Set Environment Variables

Go to Netlify Dashboard → Site Settings → Environment Variables and add your Firebase config.

### Backend: Render

Follow the same steps as in [Option 2 - Backend: Render](#backend-render)

---

## 🖥️ Option 4: Self-Hosted (VPS)

Deploy both frontend and backend on a VPS (DigitalOcean, AWS EC2, Linode, etc.)

### Prerequisites

- A VPS with Ubuntu 20.04+ or similar
- SSH access to your server
- Domain name (optional but recommended)

### Step 1: Connect to Your Server

```bash
ssh root@YOUR_SERVER_IP
```

### Step 2: Install Node.js and npm

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y nginx
```

### Step 3: Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### Step 4: Clone Your Project

```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/iv-drip-monitor.git
cd iv-drip-monitor
```

### Step 5: Setup Backend

```bash
cd server
npm install
pm2 start server.js --name iv-drip-backend
pm2 save
pm2 startup
```

### Step 6: Build and Setup Frontend

```bash
cd ../iv-monitor-client
npm install
npm run build
```

### Step 7: Configure Nginx

Create Nginx config:
```bash
sudo nano /etc/nginx/sites-available/iv-drip-monitor
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # Frontend
    location / {
        root /var/www/iv-drip-monitor/iv-monitor-client/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/iv-drip-monitor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: Setup SSL (Optional but Recommended)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d YOUR_DOMAIN
```

---

## 🔐 Environment Variables Setup

### For Production

Create a `.env.production` file in `iv-monitor-client/`:

```env
REACT_APP_FIREBASE_API_KEY=your_actual_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Security Best Practices

1. **Never commit `.env` files** to version control
2. Add `.env*` to `.gitignore`
3. Use platform-specific environment variable settings
4. Rotate API keys regularly
5. Enable Firebase App Check for production

---

## ✅ Post-Deployment Testing

After deployment, test these features:

### 1. Google Login
- ✅ Click "Sign in with Google"
- ✅ Verify authentication works
- ✅ Check if user is redirected to dashboard

### 2. Dashboard Functionality
- ✅ Patient monitors load correctly
- ✅ Real-time drip level updates work
- ✅ Add new monitor functionality
- ✅ Search/filter features work

### 3. API Endpoints
- ✅ Test `/api/patients` endpoint
- ✅ Verify CORS is configured correctly
- ✅ Check response times

### 4. Mobile Responsiveness
- ✅ Test on mobile devices
- ✅ Verify UI is responsive
- ✅ Check touch interactions

---

## 🐛 Common Deployment Issues

### Issue 1: Firebase Authentication Not Working

**Solution:** Add your production domain to Firebase Console:
1. Go to Firebase Console → Authentication → Settings
2. Add your domain to "Authorized domains"

### Issue 2: CORS Errors

**Solution:** Update backend CORS configuration:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://your-frontend-domain.com', 'https://your-project.web.app'],
  credentials: true
}));
```

### Issue 3: Environment Variables Not Loading

**Solution:** 
- Ensure variables start with `REACT_APP_`
- Rebuild after changing environment variables
- Clear cache and redeploy

### Issue 4: 404 on Page Refresh

**Solution:** Configure your hosting to redirect all routes to `index.html` (SPA configuration)

---

## 📊 Recommended Deployment Strategy

For your IV Drip Monitoring System, I recommend:

**🥇 Best Option: Firebase Hosting + Firebase Cloud Functions**
- ✅ Seamless integration with Firebase Auth
- ✅ Free tier is generous
- ✅ Automatic SSL
- ✅ Global CDN
- ✅ Easy to manage

**🥈 Alternative: Vercel + Render**
- ✅ Great developer experience
- ✅ Free tiers available
- ✅ Automatic deployments from Git
- ✅ Good performance

---

## 📞 Need Help?

If you encounter issues during deployment:
1. Check the platform-specific logs
2. Verify all environment variables are set
3. Test API endpoints independently
4. Check Firebase Console for authentication issues

---

**Good luck with your deployment! 🚀**
