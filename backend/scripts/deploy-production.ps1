# PowerShell script for production deployment
# Usage: .\scripts\deploy-production.ps1

Write-Host "🚀 Deploying MVNO Backend to Production..." -ForegroundColor Green

# Set environment variables for production
$env:NODE_ENV = "production"

# Build for production
Write-Host "🔨 Building for production..." -ForegroundColor Yellow
npm run build:production

# Check if build was successful
if (-not (Test-Path "dist")) {
    Write-Host "❌ Build failed. Please check for errors." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully" -ForegroundColor Green

# Generate Prisma client for production
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npm run prisma:generate

# Deploy to production server (SSH)
$PRODUCTION_HOST = "your-production-server.com"
$PRODUCTION_USER = "your-username"
$PRODUCTION_PATH = "/path/to/your/app"

Write-Host "📤 Deploying to production server..." -ForegroundColor Yellow
Write-Host "Server: $PRODUCTION_HOST" -ForegroundColor Cyan
Write-Host "User: $PRODUCTION_USER" -ForegroundColor Cyan
Write-Host "Path: $PRODUCTION_PATH" -ForegroundColor Cyan

# Create deployment package
$DEPLOY_PACKAGE = "deploy-production-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"
Write-Host "📦 Creating deployment package: $DEPLOY_PACKAGE" -ForegroundColor Yellow

# Add files to zip (you may need to install 7-Zip or use PowerShell's Compress-Archive)
# For now, we'll just copy files
if (Test-Path "deploy") { Remove-Item "deploy" -Recurse -Force }
New-Item -ItemType Directory -Name "deploy" | Out-Null
Copy-Item "dist\*" "deploy\" -Recurse
Copy-Item "package.json" "deploy\"
Copy-Item "env.production" "deploy\.env"
Copy-Item "prisma" "deploy\" -Recurse

Write-Host "✅ Deployment package created" -ForegroundColor Green

# Instructions for manual deployment
Write-Host ""
Write-Host "📋 Manual Deployment Steps:" -ForegroundColor Cyan
Write-Host "1. Copy the 'deploy' folder to your production server" -ForegroundColor White
Write-Host "2. SSH to your production server: ssh $PRODUCTION_USER@$PRODUCTION_HOST" -ForegroundColor White
Write-Host "3. Navigate to app directory: cd $PRODUCTION_PATH" -ForegroundColor White
Write-Host "4. Stop current app: pm2 stop mvno-backend (or your process manager)" -ForegroundColor White
Write-Host "5. Backup current version" -ForegroundColor White
Write-Host "6. Copy new files from deploy folder" -ForegroundColor White
Write-Host "7. Install dependencies: npm install --production" -ForegroundColor White
Write-Host "8. Run migrations: npm run prisma:migrate:deploy" -ForegroundColor White
Write-Host "9. Start app: pm2 start mvno-backend (or your process manager)" -ForegroundColor White
Write-Host "10. Check logs: pm2 logs mvno-backend" -ForegroundColor White

Write-Host ""
Write-Host "🎯 Deployment package ready in 'deploy' folder" -ForegroundColor Green
