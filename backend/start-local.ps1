# Quick start script for local development
# Usage: .\start-local.ps1

Write-Host "🚀 Quick Start - MVNO Backend Local Development" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan

# Set environment
$env:NODE_ENV = "development"
Write-Host "✅ Environment set to: development" -ForegroundColor Green

# Check if database is running
Write-Host "📋 Checking if database is running..." -ForegroundColor Yellow
try {
    $dbStatus = docker ps --filter "name=mvno10-db-1" --format "table {{.Names}}\t{{.Status}}" 2>$null
    if ($dbStatus -match "mvno10-db-1") {
        Write-Host "✅ Database is already running" -ForegroundColor Green
    } else {
        Write-Host "🗄️  Starting database..." -ForegroundColor Yellow
        docker-compose up -d db
        Start-Sleep -Seconds 5
    }
} catch {
    Write-Host "❌ Docker not available. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npm run prisma:generate

# Run migrations
Write-Host "🔄 Running database migrations..." -ForegroundColor Yellow
npm run prisma:migrate

# Start development server
Write-Host ""
Write-Host "🚀 Starting development server..." -ForegroundColor Green
Write-Host "📍 Backend will be available at: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🗄️  Database: localhost:5432" -ForegroundColor Cyan
Write-Host "🔧 Prisma Studio: npm run prisma:studio" -ForegroundColor Cyan
Write-Host ""

npm run dev
