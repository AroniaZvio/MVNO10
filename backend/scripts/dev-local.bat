@echo off
REM Batch script for local development on Windows
REM Usage: scripts\dev-local.bat

echo 🚀 Starting MVNO Backend in Local Development Mode...

REM Set environment variables for Windows
set NODE_ENV=development

REM Check if Docker is running
echo 📋 Checking Docker status...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)
echo ✅ Docker is running

REM Start database if not running
echo 🗄️  Starting PostgreSQL database...
docker-compose up -d db

REM Wait for database to be ready
echo ⏳ Waiting for database to be ready...
timeout /t 5 /nobreak >nul

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npm run prisma:generate

REM Run migrations
echo 🔄 Running database migrations...
npm run prisma:migrate

REM Start development server
echo 🚀 Starting development server...
npm run dev:local

pause

