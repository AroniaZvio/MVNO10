# PowerShell script for Render deployment
# Usage: .\scripts\deploy-render.ps1

Write-Host "🚀 Deploying MVNO Backend to Render..." -ForegroundColor Green

# Set environment variables for Render
$env:NODE_ENV = "render"

# Build for Render
Write-Host "🔨 Building for Render..." -ForegroundColor Yellow
npm run build:render

# Check if build was successful
if (-not (Test-Path "dist")) {
    Write-Host "❌ Build failed. Please check for errors." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully" -ForegroundColor Green

# Generate Prisma client for Render
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npm run prisma:generate

# Check if render.yaml exists
if (-not (Test-Path "render.yaml")) {
    Write-Host "❌ render.yaml not found. Please create it first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ render.yaml found" -ForegroundColor Green

# Instructions for Render deployment
Write-Host ""
Write-Host "📋 Render Deployment Steps:" -ForegroundColor Cyan
Write-Host "1. Make sure your code is pushed to Git repository" -ForegroundColor White
Write-Host "2. Connect your repository to Render" -ForegroundColor White
Write-Host "3. Set environment variables in Render dashboard:" -ForegroundColor White
Write-Host "   - NODE_ENV=render" -ForegroundColor White
Write-Host "   - DATABASE_URL=your-render-postgres-url" -ForegroundColor White
Write-Host "   - JWT_SECRET=your-jwt-secret" -ForegroundColor White
Write-Host "   - SMTP_HOST=smtp.gmail.com" -ForegroundColor White
Write-Host "   - SMTP_PORT=587" -ForegroundColor White
Write-Host "   - SMTP_USER=your-email" -ForegroundColor White
Write-Host "   - SMTP_PASS=your-app-password" -ForegroundColor White
Write-Host "   - SMTP_FROM=noreply@yourdomain.com" -ForegroundColor White
Write-Host "   - CORS_ORIGIN=https://your-app.onrender.com" -ForegroundColor White
Write-Host "4. Set build command: npm run build:render" -ForegroundColor White
Write-Host "5. Set start command: npm run start:render" -ForegroundColor White
Write-Host "6. Deploy!" -ForegroundColor White

Write-Host ""
Write-Host "🎯 Your app will be automatically deployed when you push to Git!" -ForegroundColor Green
Write-Host "📊 Monitor deployment at: https://dashboard.render.com" -ForegroundColor Cyan

