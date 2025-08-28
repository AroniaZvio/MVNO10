@echo off
echo 🚀 Starting MVNO Backend in Local Development Mode...

REM Set environment variable
set NODE_ENV=development

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
echo 📍 Backend will be available at: http://localhost:3001
echo 🗄️  Database: localhost:5432
echo.

npm run dev

pause
