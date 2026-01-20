@echo off
REM تفعيل البيئة الافتراضية
call .venv\Scripts\activate.bat

REM الذهاب إلى مجلد backend
cd backend

REM تطبيق migrations
python manage.py migrate

REM تشغيل الـ server
python manage.py runserver 0.0.0.0:8000

pause
