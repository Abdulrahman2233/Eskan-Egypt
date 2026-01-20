@echo off
echo ========================================
echo Eskan Project Startup Script
echo ========================================
echo.

echo [1/3] Opening Backend Terminal...
start cmd /k "cd /d %CD%\backend && echo Starting Django Backend... && python manage.py runserver 0.0.0.0:8000"

echo [2/3] Waiting for Backend to start...
timeout /t 3 /nobreak

echo [3/3] Opening Frontend Terminal...
start cmd /k "cd /d %CD% && echo Starting React Frontend... && npm run dev"

echo.
echo ========================================
echo ✓ Both servers are starting!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000
echo.
echo Press any key to close this window...
pause >nul
