@echo off
title AbleSpace GitHub Uploader

echo ===================================================
echo   AbleSpace Task Manager - GitHub Auto-Uploader
echo ===================================================
echo.

cd /d "%~dp0"

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your PATH.
    echo Please install Git from: https://git-scm.com/downloads
    pause
    exit
)

:: Ask the user for their GitHub repository link
set /p REPO_URL="Enter your GitHub Repository URL (e.g., https://github.com/username/repo.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] Repository URL cannot be empty.
    pause
    exit
)

echo.
echo [1/4] Initializing local Git repository...
if not exist .git (
    git init
)

echo [2/4] Staging and committing files...
git add .
git commit -m "Complete implementation of Next.js frontend and NestJS backend"

echo [3/4] Setting main branch and remote origin...
git branch -M main
git remote remove origin >nul 2>nul
git remote add origin %REPO_URL%

echo [4/4] Pushing code to GitHub...
echo (You may be prompted to log in to GitHub in a popup window)
git push -u origin main

if %errorlevel% eq 0 (
    echo.
    echo ===================================================
    echo   SUCCESS! Your code has been uploaded to GitHub!
    echo ===================================================
) else (
    echo.
    echo [ERROR] Failed to push code to GitHub. Please check your internet connection or login credentials.
)

pause
