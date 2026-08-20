@echo off
title AbleSpace Task Manager Runner

echo ===================================================
echo   AbleSpace Task Management System - Automation Launcher
echo ===================================================

:: Ensure working directory is the batch script's directory
cd /d "%~dp0"

:: 1. Setup Backend
echo.
echo [1/3] Setting up NestJS Backend...
cd backend
if not exist node_modules (
    echo Installing backend node modules - this may take a minute...
    call npm install
) else (
    echo Backend dependencies are already installed.
)
echo Syncing SQLite database via Prisma...
call npm run prisma:db:push
call npm run prisma:generate
cd ..

:: 2. Setup Frontend
echo.
echo [2/3] Setting up Next.js Frontend...
cd frontend
if not exist node_modules (
    echo Installing frontend node modules - this may take a minute...
    call npm install
) else (
    echo Frontend dependencies are already installed.
)
cd ..

:: 3. Launch Services Concurrently
echo.
echo [3/3] Launching backend and frontend servers in separate windows...

:: Launch NestJS Backend on port 3001
start "AbleSpace Backend (Port 3001)" cmd /k "cd /d "%~dp0backend" && npm run start:dev"

:: Launch Next.js Frontend on port 3000
start "AbleSpace Frontend (Port 3000)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ===================================================
echo   Done! Both servers have been launched:
echo   - Frontend: http://localhost:3000
echo   - Backend API: http://localhost:3001/api
echo ===================================================
echo Opening dashboard in your browser in 5 seconds...
timeout /t 5 >nul
start http://localhost:3000
exit
