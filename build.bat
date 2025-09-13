@echo off
echo 🚀 Starting MVNO10 Build Process for Hosting...

REM Check if we're in the right directory
if not exist "web\package.json" (
    echo ❌ Please run this script from the MVNO10 root directory
    exit /b 1
)
if not exist "backend\package.json" (
    echo ❌ Please run this script from the MVNO10 root directory
    exit /b 1
)

echo 📦 Building Frontend (React + Vite)...
cd web

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Frontend dependency installation failed
        exit /b 1
    )
)

REM Build frontend
call npm run build
if errorlevel 1 (
    echo ❌ Frontend build failed
    exit /b 1
)

echo ✅ Frontend build completed successfully!
cd ..

echo 🔧 Building Backend (Node.js + Express)...
cd backend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Backend dependency installation failed
        exit /b 1
    )
)

REM Build backend
call npm run build
if errorlevel 1 (
    echo ❌ Backend build failed
    exit /b 1
)

echo ✅ Backend build completed successfully!
cd ..

echo 🔍 Verifying build outputs...

if exist "web\dist\index.html" (
    echo ✅ Frontend build output found: web\dist\
) else (
    echo ⚠️ Frontend build output not found
)

if exist "backend\dist\server.js" (
    echo ✅ Backend build output found: backend\dist\
) else (
    echo ⚠️ Backend build output not found
)

echo.
echo 📊 Build Summary:
echo Frontend: web\dist\
echo Backend: backend\dist\
echo Database: PostgreSQL (configured in docker-compose.yml)
echo Deployment: Render.com (configured in render.yaml)

echo.
echo 🎉 Build process completed successfully!
echo Your application is ready for hosting!

pause
