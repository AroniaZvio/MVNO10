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
Write-Host "1. Create PostgreSQL database in Render dashboard" -ForegroundColor White
Write-Host "   - Go to https://dashboard.render.com" -ForegroundColor Gray
Write-Host "   - Click 'New +' → 'PostgreSQL'" -ForegroundColor Gray
Write-Host "   - Name: mobilive-db" -ForegroundColor Gray
Write-Host "   - Database: mvno_db" -ForegroundColor Gray
Write-Host "   - User: mvno_user" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Get database connection string:" -ForegroundColor White
Write-Host "   - Copy 'External Database URL' from database info" -ForegroundColor Gray
Write-Host "   - Update backend/env.render with your DATABASE_URL" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Push code to Git repository" -ForegroundColor White
Write-Host "4. Connect repository to Render (render.yaml will be auto-detected)" -ForegroundColor White
Write-Host "5. Environment variables are configured in render.yaml:" -ForegroundColor White
Write-Host "   - DATABASE_URL: Auto-generated from database service" -ForegroundColor Gray
Write-Host "   - JWT_SECRET: Auto-generated" -ForegroundColor Gray
Write-Host "   - SMTP_*: Update with your email settings" -ForegroundColor Gray
Write-Host "   - CORS_ORIGIN: Update with your app URL" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Deploy! Render will automatically:" -ForegroundColor White
Write-Host "   - Install dependencies" -ForegroundColor Gray
Write-Host "   - Build the application" -ForegroundColor Gray
Write-Host "   - Generate Prisma client" -ForegroundColor Gray
Write-Host "   - Run database migrations" -ForegroundColor Gray
Write-Host "   - Start the application" -ForegroundColor Gray

Write-Host ""
Write-Host "🎯 Your app will be automatically deployed when you push to Git!" -ForegroundColor Green
Write-Host "📊 Monitor deployment at: https://dashboard.render.com" -ForegroundColor Cyan

