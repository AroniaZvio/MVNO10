# 🪟 Windows Setup Guide

## 🚀 Quick Start (Windows)

### Option 1: PowerShell Script (Recommended)
```powershell
cd backend
.\start-local.ps1
```

### Option 2: Batch File
```cmd
cd backend
start-local.bat
```

### Option 3: Manual Commands
```powershell
cd backend
$env:NODE_ENV = "development"
npm run dev
```

---

## 🔧 Prerequisites

1. **Node.js 20.x** - Download from [nodejs.org](https://nodejs.org/)
2. **Docker Desktop** - Download from [docker.com](https://docker.com/)
3. **PowerShell** - Built into Windows 10/11

---

## 📋 Step-by-Step Setup

### 1. Start Database
```cmd
cd D:\APP\MVNO10
docker-compose up -d db
```

### 2. Start Backend
```powershell
cd backend
.\start-local.ps1
```

---

## 🐛 Common Windows Issues

### Issue: "NODE_ENV is not recognized"
**Solution:** Use PowerShell or set environment variable first:
```powershell
$env:NODE_ENV = "development"
npm run dev
```

### Issue: "docker command not found"
**Solution:** Install Docker Desktop and restart PowerShell

### Issue: "Permission denied"
**Solution:** Run PowerShell as Administrator

### Issue: "Script execution policy"
**Solution:** Run this in PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 🔄 Environment Switching

### Set Environment Variable
```powershell
# Local development
$env:NODE_ENV = "development"

# Production mode
$env:NODE_ENV = "production"

# Render mode
$env:NODE_ENV = "render"
```

### Use Environment Scripts
```powershell
.\scripts\set-env.ps1 local
.\scripts\set-env.ps1 production
.\scripts\set-env.ps1 render
```

---

## 📚 Available Commands

```bash
# Development
npm run dev                    # Start development server
npm run prisma:studio         # Open database GUI
npm run db:setup              # Setup database + seed

# Building
npm run build                 # Build for development
npm run build:production      # Build for production
npm run build:render          # Build for Render

# Database
npm run prisma:generate       # Generate Prisma client
npm run prisma:migrate        # Run migrations
npm run prisma:migrate:deploy # Run production migrations
```

---

## 🆘 Need Help?

1. **Check if Docker is running** - Look for Docker Desktop icon in system tray
2. **Verify Node.js version** - `node --version` should show 20.x
3. **Check PowerShell execution policy** - Run as Administrator if needed
4. **Restart PowerShell** - After installing Docker Desktop

---

## 💡 Tips for Windows Users

- Use PowerShell instead of Command Prompt for better experience
- Keep Docker Desktop running in background
- Use `start-local.ps1` for easiest setup
- Environment variables are session-specific in PowerShell

---

**Happy Coding on Windows! 🎉**
