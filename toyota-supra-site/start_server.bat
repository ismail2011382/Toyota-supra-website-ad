@echo off
echo ========================================
echo    Toyota GR Supra - Premium Website
echo ========================================
echo.
echo Server running at http://127.0.0.1:8083
echo.

timeout /t 2 >nul
start http://127.0.0.1:8083

python -m http.server 8083 --bind 127.0.0.1
pause
