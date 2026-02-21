# 🏥 IV Drip Monitoring System

A real-time IV drip monitoring system with Google authentication, built with React and Node.js.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📂 Project Structure

```
IV DRIPS/
├── server/                    # Backend API (Node.js + Express)
│   ├── server.js             # Main server file
│   ├── data/                 # Patient data storage
│   └── package.json
│
├── iv-monitor-client/        # Frontend Dashboard (React)
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── firebase.js       # Firebase configuration
│   │   └── App.js           # Main app component
│   ├── public/
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md       # 📘 Complete deployment guide
├── QUICK_DEPLOY.md          # ⚡ Quick deployment reference
└── .agent/workflows/        # Deployment workflows
```

---

## 🚀 Quick Start

### Development Mode

You need **two terminals** to run the application:

#### Terminal 1: Backend Server
```bash
cd server
npm install
node server.js
```
✅ Server runs on `http://localhost:5000`

#### Terminal 2: Frontend Client
```bash
cd iv-monitor-client
npm install
npm start
```
✅ Dashboard opens at `http://localhost:3000`

---

## 🔑 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Google Authentication**
3. Copy your Firebase config
4. Update `iv-monitor-client/.env`:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. Restart the frontend server

---

## 🛠 Features

### ✨ Core Features
- 🔐 **Google OAuth Login** - Secure authentication via Firebase
- 📊 **Real-time Monitoring** - Live IV drip level tracking
- ➕ **Add Monitors** - Track new patients instantly
- 🔍 **Smart Search** - Filter by name, ward, or saline type
- 🎭 **Demo Mode** - Instant access with simulated data
- 📱 **Responsive Design** - Works on all devices

### 🎨 UI/UX
- Modern glassmorphism design
- Smooth animations and transitions
- Color-coded status indicators
- Real-time progress bars
- Mobile-optimized interface

---

## 📦 Deployment

### 🚀 GitHub Deployment (Recommended)

**Your project is already initialized with Git!** ✅

**Quick Steps:**

1. **Create GitHub Repository:**
   - Go to https://github.com/new
   - Name: `iv-drip-monitoring-system`
   - Click "Create repository"

2. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/iv-drip-monitoring-system.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy Frontend to Vercel:**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Deploy! (2 minutes)

4. **Deploy Backend to Render:**
   - Go to https://render.com
   - Connect your GitHub repository
   - Deploy! (2 minutes)

📘 **Detailed guides:**
- [QUICK_GITHUB_DEPLOY.md](./QUICK_GITHUB_DEPLOY.md) - Quick reference (5 minutes)
- [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md) - Complete guide with all options

### Other Deployment Options

- **Firebase Hosting**: See `DEPLOYMENT_GUIDE.md`
- **Netlify**: See `GITHUB_DEPLOYMENT.md`
- **Self-hosted**: See `DEPLOYMENT_GUIDE.md`

---

## 🧪 Testing

### Test the Application

1. **Login Test**: Click "Sign in with Google"
2. **Dashboard Test**: Verify patient monitors load
3. **Add Monitor**: Click "+ Add New Monitor"
4. **Real-time Updates**: Watch drip levels decrease
5. **Search**: Filter patients by name/ward
6. **Demo Mode**: Test instant demo access

---

## 🔧 Tech Stack

### Frontend
- **React** 19.2.4 - UI framework
- **Firebase** 12.8.0 - Authentication
- **Axios** 1.13.4 - HTTP client
- **CSS3** - Styling with glassmorphism

### Backend
- **Node.js** - Runtime environment
- **Express** 5.2.1 - Web framework
- **CORS** 2.8.6 - Cross-origin support
- **JWT** 9.0.3 - Token authentication

---

## 📱 Screenshots

### Login Page
Modern authentication with Google OAuth and demo mode

### Dashboard
Real-time monitoring with search and filter capabilities

### Add Monitor
Simple form to add new patient monitors

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Dashboard is blank**
- ✅ Check Firebase configuration in `.env`
- ✅ Ensure backend server is running
- ✅ Check browser console for errors

**Issue: Google login not working**
- ✅ Verify Firebase Authentication is enabled
- ✅ Check if domain is authorized in Firebase Console
- ✅ Ensure `.env` variables are correct

**Issue: API calls failing**
- ✅ Confirm backend is running on port 5000
- ✅ Check CORS configuration
- ✅ Verify API endpoint URLs

**Issue: Build fails**
- ✅ Run `npm install` in both folders
- ✅ Delete `node_modules` and reinstall
- ✅ Check Node.js version (requires 14+)

---

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Quick reference for deployment
- **[.agent/workflows/deploy-firebase.md](./.agent/workflows/deploy-firebase.md)** - Firebase deployment workflow

---

## 🔒 Security

### Best Practices Implemented

- ✅ Environment variables for sensitive data
- ✅ Firebase Authentication for secure login
- ✅ CORS configuration for API security
- ✅ `.gitignore` to prevent credential commits
- ✅ JWT tokens for API authentication

### Before Deploying

1. Never commit `.env` files
2. Add production domain to Firebase Authorized Domains
3. Enable Firebase App Check in production
4. Use HTTPS for all production deployments
5. Rotate API keys regularly

---

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

---

## 📄 License

MIT License - feel free to use this project for learning or personal use.

---

## 🎯 Roadmap

### Planned Features
- [ ] SMS/Email alerts for low fluid levels
- [ ] Historical data tracking and analytics
- [ ] Multi-hospital support
- [ ] Mobile app (React Native)
- [ ] Nurse assignment system
- [ ] Export reports to PDF

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the deployment guide
3. Check Firebase Console for auth issues
4. Verify all environment variables are set

---

## 🌟 Acknowledgments

Built with ❤️ using modern web technologies

- Firebase for authentication
- React for the frontend
- Node.js for the backend

---

**Ready to deploy?** 🚀

Start with the [Quick Deploy Guide](./QUICK_DEPLOY.md) or follow the comprehensive [Deployment Guide](./DEPLOYMENT_GUIDE.md).

**Need help?** Check the troubleshooting section or review the documentation.

---

*Last updated: February 2026*
