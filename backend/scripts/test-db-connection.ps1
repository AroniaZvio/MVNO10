# PowerShell script to test database connection
# Usage: .\scripts\test-db-connection.ps1

Write-Host "🔍 Testing Database Connection..." -ForegroundColor Green

# Set environment to render for testing
$env:NODE_ENV = "render"

# Check if env.render exists
if (-not (Test-Path "env.render")) {
    Write-Host "❌ env.render file not found. Please create it first." -ForegroundColor Red
    Write-Host "   Copy from env.render template and update DATABASE_URL" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ env.render file found" -ForegroundColor Green

# Load environment variables
Write-Host "📋 Loading environment variables..." -ForegroundColor Yellow
dotenv -f env.render

# Test Prisma connection
Write-Host "🔧 Testing Prisma connection..." -ForegroundColor Yellow
try {
    # Generate Prisma client
    npm run prisma:generate
    
    # Test database connection
    npx prisma db pull --preview-feature
    
    Write-Host "✅ Database connection successful!" -ForegroundColor Green
    Write-Host "📊 Database schema is accessible" -ForegroundColor Green
    
    # Show database info
    Write-Host ""
    Write-Host "📋 Database Information:" -ForegroundColor Cyan
    Write-Host "   Environment: $env:NODE_ENV" -ForegroundColor White
    Write-Host "   Database URL: $env:DATABASE_URL" -ForegroundColor White
    
} catch {
    Write-Host "❌ Database connection failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Troubleshooting steps:" -ForegroundColor Yellow
    Write-Host "   1. Check if DATABASE_URL is correct in env.render" -ForegroundColor White
    Write-Host "   2. Verify database is running in Render dashboard" -ForegroundColor White
    Write-Host "   3. Check if database credentials are correct" -ForegroundColor White
    Write-Host "   4. Ensure database is accessible from your IP" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "🎉 Database connection test completed successfully!" -ForegroundColor Green
Write-Host "🚀 You can now deploy to Render with confidence!" -ForegroundColor Cyan

