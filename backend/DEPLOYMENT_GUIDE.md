# 🚀 MVNO Backend - Deployment Guide

## 📋 Overview

This guide covers setting up the MVNO backend for:
- 🏠 **Local Development** - with local PostgreSQL database
- 🌐 **Production Server** - traditional VPS deployment
- ☁️ **Render** - cloud platform deployment

## 🏠 Local Development Setup

### Prerequisites
- Node.js 20.x
- Docker Desktop
- PowerShell (Windows) or Bash (Linux/Mac)

### Quick Start

1. **Start the database:**
   ```bash
   cd D:\APP\MVNO10
   docker-compose up -d db
   ```

2. **Run the development script:**
   ```powershell
   cd backend
   .\start-local.ps1
   ```

   Or manually:
   ```bash
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run dev
   ```

   **For Windows users:**
   ```cmd
   cd backend
   start-local.bat
   ```

3. **Access your app:**
   - Backend: http://localhost:3001
   - Database: localhost:5432
   - Prisma Studio: `npm run prisma:studio:local`

### Environment Variables
The app automatically loads `env.local` for development. Key variables:
- `DATABASE_URL`: Local PostgreSQL connection
- `JWT_SECRET`: Development JWT key
- `PORT`: 3001 (default)

## 🌐 Production Server Deployment

### Prerequisites
- VPS with Ubuntu/CentOS
- PostgreSQL installed
- Node.js 20.x
- PM2 or similar process manager

### Deployment Steps

1. **Build for production:**
   ```bash
   npm run build:production
   ```

2. **Run deployment script:**
   ```powershell
   .\scripts\deploy-production.ps1
   ```

3. **Manual deployment:**
   ```bash
   # On production server
   ssh user@your-server.com
   cd /path/to/app
   
   # Stop current app
   pm2 stop mvno-backend
   
   # Copy new files
   # Run migrations
   npm run prisma:migrate:deploy
   
   # Start app
   pm2 start mvno-backend
   ```

### Environment Variables
Set these on your production server:
- `NODE_ENV=production`
- `DATABASE_URL`: Production PostgreSQL
- `JWT_SECRET`: Strong production key
- `SMTP_*`: Email configuration

## ☁️ Render Deployment

### Prerequisites
- Git repository
- Render account
- PostgreSQL database on Render

### Deployment Steps

1. **Build for Render:**
   ```bash
   npm run build:render
   ```

2. **Run Render deployment script:**
   ```powershell
   .\scripts\deploy-render.ps1
   ```

3. **Connect to Render:**
   - Link your Git repository
   - Set environment variables
   - Deploy automatically

### Environment Variables in Render
- `NODE_ENV=render`
- `DATABASE_URL`: Render PostgreSQL URL
- `JWT_SECRET`: Production JWT key
- `SMTP_*`: Email configuration

## 🔧 Available Scripts

### Development
```bash
npm run dev:local          # Local development
npm run dev:production     # Production mode locally
npm run dev:render         # Render mode locally
```

### Building
```bash
npm run build              # Development build
npm run build:production   # Production build
npm run build:render       # Render build
```

### Database
```bash
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations (dev)
npm run prisma:migrate:deploy  # Run migrations (prod)
npm run prisma:studio      # Open Prisma Studio
npm run db:setup           # Setup database + seed
npm run db:reset           # Reset database
```

### Starting
```bash
npm start                  # Start production build
npm run start:production   # Start in production mode
npm run start:render       # Start in Render mode
```

## 📁 File Structure

```
backend/
├── env.local              # Local development config
├── env.production         # Production server config
├── env.render            # Render deployment config
├── src/
│   ├── lib/
│   │   ├── config.ts     # Environment configuration
│   │   └── prisma.ts     # Database client
│   └── server.ts         # Main server file
├── scripts/
│   ├── dev-local.ps1     # Local development script
│   ├── deploy-production.ps1  # Production deployment
│   └── deploy-render.ps1      # Render deployment
└── prisma/
    └── schema.prisma     # Database schema
```

## 🔒 Security Notes

- Never commit `.env*` files to Git
- Use strong JWT secrets in production
- Restrict database access with proper firewall rules
- Use HTTPS in production
- Regularly update dependencies

## 🐛 Troubleshooting

### Common Issues

1. **Database connection failed:**
   - Check if Docker is running
   - Verify database credentials in env file
   - Check if port 5432 is available

2. **Port already in use:**
   - Change PORT in env file
   - Kill process using the port

3. **Prisma errors:**
   - Run `npm run prisma:generate`
   - Check database schema
   - Verify DATABASE_URL format

### Logs
- Development: Console output
- Production: PM2 logs (`pm2 logs mvno-backend`)
- Render: Dashboard logs

## 📞 Support

For issues or questions:
1. Check the logs
2. Verify environment variables
3. Test database connection
4. Check Prisma schema

---

**Happy Coding! 🎉**

