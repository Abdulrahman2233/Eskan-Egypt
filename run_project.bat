@echo off
chcp 65001 >nul
title Sakn Egypt Project Runner

echo ==========================================
echo 🔹 بدء تشغيل مشروع سكن مصر...
echo ==========================================

REM Check if running from correct directory
if not exist "backend" (
    echo ❌ خطأ: يجب تشغيل هذا الملف من D:\proj\eskan
    pause
    exit /b 1
)

REM Start Backend in new window
echo 🟢 تشغيل Django Backend...
cd backend
start "Django Backend" cmd /k "..\.venv\Scripts\activate.bat && python manage.py runserver 0.0.0.0:8000"

REM Wait longer for backend to initialize
timeout /t 5 /nobreak

REM Start Frontend in new window
echo 🟢 تشغيل React Frontend...
cd ..
start "React Frontend - Vite" cmd /k "npm run dev"

echo.
echo ==========================================
echo ✅ تم تشغيل السيرفرين بنجاح!
echo ==========================================
echo.
echo 🌐 الفرونت اند: http://localhost:5173
echo 🔌 الباك اند: http://localhost:8000
echo.
echo اغلق نوافذ الأوامر لإيقاف السيرفرات
echo ==========================================
echo.

pause
