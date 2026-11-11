@echo off
title ARIF-LAB INVENTORY - Local Static Server

echo ========================================================
echo   ARIF-LAB INVENTORY - Laboratory Search System
echo ========================================================
echo.

:: Check if Python is available
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python detected on system.
    echo Starting local HTTP web server on port 8000...
    echo.
    echo Opening browser at: http://localhost:8000
    start http://localhost:8000
    echo.
    echo Press Ctrl+C in this terminal window to stop the server.
    echo.
    python -m http.server 8000
    goto end
)

:: Check if Python3 is available (alternative command)
py --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python launcher detected.
    echo Starting local HTTP web server on port 8000...
    start http://localhost:8000
    py -m http.server 8000
    goto end
)

:: If Python is not installed, open index.html directly in browser
echo [INFO] Python was not found in your system PATH.
echo.
echo You can run this web application directly by opening 'index.html' in any modern web browser.
echo Opening index.html directly...
start index.html

:end
pause
