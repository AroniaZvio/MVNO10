# 🚀 Quick Start Guide

## 🏠 Local Development (5 minutes)

### 1. Start Database
```bash
cd D:\APP\MVNO10
docker-compose up -d db
```

### 2. Run Development Script
```powershell
cd backend
.\start-local.ps1
```

**Or use the simple command:**
```powershell
cd backend
$env:NODE_ENV = "development"
npm run dev
```

**That's it!** Your backend will be running at http://localhost:3001

---

## 🔄 Switch Environments

```powershell
# Local development
.\scripts\switch-env.ps1 local

# Production mode
.\scripts\switch-env.ps1 production

# Render mode
.\scripts\switch-env.ps1 render
```

---

## 📚 Available Commands

```bash
# Development
npm run dev:local          # Start local development
npm run prisma:studio      # Open database GUI
npm run db:setup           # Setup database + seed

# Building
npm run build:production   # Build for production
npm run build:render       # Build for Render

# Deployment
.\scripts\deploy-production.ps1  # Deploy to production
.\scripts\deploy-render.ps1      # Deploy to Render
```

---

## 🆘 Need Help?

- 📖 Full guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- 🐛 Issues: Check logs and environment variables
- 📧 Support: Check the main README

---

**Happy Coding! 🎉**

