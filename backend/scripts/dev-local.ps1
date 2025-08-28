# PowerShell script for local development on Windows
# Usage: .\scripts\dev-local.ps1

Write-Host "🚀 Starting MVNO Backend in Local Development Mode..." -ForegroundColor Green

# Set environment variables for Windows
$env:NODE_ENV = "development"

# Check if Docker is running
Write-Host "📋 Checking Docker status..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Start database if not running
Write-Host "🗄️  Starting PostgreSQL database..." -ForegroundColor Yellow
docker-compose up -d db

# Wait for database to be ready
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

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
Write-Host "🚀 Starting development server..." -ForegroundColor Green
npm run dev
