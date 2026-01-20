#!/usr/bin/env pwsh

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Eskan Project Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Python
Write-Host "[1/4] Checking Python..." -ForegroundColor Yellow
python --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Python not found!" -ForegroundColor Red
    exit 1
}

# Check Node
Write-Host "[2/4] Checking Node..." -ForegroundColor Yellow
node --version
npm --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node/NPM not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ All prerequisites ready!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Starting Backend (port 8000)..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd backend && python manage.py runserver 0.0.0.0:8000"

Start-Sleep -Seconds 3

Write-Host "Starting Frontend (port 5173)..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ Both servers started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "Backend: http://localhost:8000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C in either window to stop" -ForegroundColor Yellow
