# PowerShell script for switching between environments
# Usage: .\scripts\switch-env.ps1 [local|production|render]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("local", "production", "render")]
    [string]$Environment
)

Write-Host "🔄 Switching to $Environment environment..." -ForegroundColor Green

# Set environment variable
$env:NODE_ENV = $Environment

# Display current environment
Write-Host "✅ Current environment: $env:NODE_ENV" -ForegroundColor Green

# Show environment-specific information
switch ($Environment) {
    "local" {
        Write-Host ""
        Write-Host "🏠 Local Development Environment:" -ForegroundColor Cyan
        Write-Host "   Database: Local PostgreSQL (Docker)" -ForegroundColor White
        Write-Host "   Port: 3001" -ForegroundColor White
        Write-Host "   Config: env.local" -ForegroundColor White
        Write-Host ""
        Write-Host "🚀 To start development:" -ForegroundColor Yellow
        Write-Host "   npm run dev:local" -ForegroundColor White
        Write-Host "   or .\scripts\dev-local.ps1" -ForegroundColor White
    }
    "production" {
        Write-Host ""
        Write-Host "🌐 Production Environment:" -ForegroundColor Cyan
        Write-Host "   Database: Remote PostgreSQL" -ForegroundColor White
        Write-Host "   Port: 3001" -ForegroundColor White
        Write-Host "   Config: env.production" -ForegroundColor White
        Write-Host ""
        Write-Host "🔨 To build for production:" -ForegroundColor Yellow
        Write-Host "   npm run build:production" -ForegroundColor White
        Write-Host "   or .\scripts\deploy-production.ps1" -ForegroundColor White
    }
    "render" {
        Write-Host ""
        Write-Host "☁️ Render Environment:" -ForegroundColor Cyan
        Write-Host "   Database: Render PostgreSQL" -ForegroundColor White
        Write-Host "   Port: 10000" -ForegroundColor White
        Write-Host "   Config: env.render" -ForegroundColor White
        Write-Host ""
        Write-Host "🔨 To build for Render:" -ForegroundColor Yellow
        Write-Host "   npm run build:render" -ForegroundColor White
        Write-Host "   or .\scripts\deploy-render.ps1" -ForegroundColor White
    }
}

# Show current database URL (masked)
$configPath = "env.$Environment"
if (Test-Path $configPath) {
    $dbUrl = Get-Content $configPath | Select-String "DATABASE_URL"
    if ($dbUrl) {
        $maskedUrl = $dbUrl -replace '://[^@]+@', '://***:***@'
        Write-Host ""
        Write-Host "🗄️  Database URL: $maskedUrl" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "💡 Tip: Use 'npm run dev:$Environment' to start in this mode" -ForegroundColor Green

