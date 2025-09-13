# MVNO10 Build Script for Hosting
# This script builds both frontend and backend for production deployment

Write-Host "Starting MVNO10 Build Process for Hosting..." -ForegroundColor Green

# Set error handling
$ErrorActionPreference = "Stop"

try {
    # Check if we're in the right directory
    if (-not (Test-Path "web\package.json") -or -not (Test-Path "backend\package.json")) {
        Write-Error "Please run this script from the MVNO10 root directory"
        exit 1
    }

    Write-Host "Building Frontend (React + Vite)..." -ForegroundColor Yellow
    Set-Location "web"
    
    # Install dependencies if node_modules doesn't exist
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
        npm install
    }
    
    # Build frontend
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Frontend build failed"
    }
    
    Write-Host "Frontend build completed successfully!" -ForegroundColor Green
    Set-Location ".."

    Write-Host "Building Backend (Node.js + Express)..." -ForegroundColor Yellow
    Set-Location "backend"
    
    # Install dependencies if node_modules doesn't exist
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
        npm install
    }
    
    # Build backend
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Backend build failed"
    }
    
    Write-Host "Backend build completed successfully!" -ForegroundColor Green
    Set-Location ".."

    # Verify build outputs
    Write-Host "Verifying build outputs..." -ForegroundColor Yellow
    
    if (Test-Path "web\dist\index.html") {
        Write-Host "Frontend build output found: web\dist\" -ForegroundColor Green
    }
    else {
        Write-Warning "Frontend build output not found"
    }
    
    if (Test-Path "backend\dist\server.js") {
        Write-Host "Backend build output found: backend\dist\" -ForegroundColor Green
    }
    else {
        Write-Warning "Backend build output not found"
    }

    # Display build summary
    Write-Host "`nBuild Summary:" -ForegroundColor Cyan
    Write-Host "Frontend: web\dist\" -ForegroundColor White
    Write-Host "Backend: backend\dist\" -ForegroundColor White
    Write-Host "Database: PostgreSQL (configured in docker-compose.yml)" -ForegroundColor White
    Write-Host "Deployment: Render.com (configured in render.yaml)" -ForegroundColor White

    Write-Host "`nBuild process completed successfully!" -ForegroundColor Green
    Write-Host "Your application is ready for hosting!" -ForegroundColor Green

}
catch {
    Write-Error "Build failed: $($_.Exception.Message)"
    exit 1
}
finally {
    # Return to original directory
    Set-Location "D:\APP\MVNO10"
}
