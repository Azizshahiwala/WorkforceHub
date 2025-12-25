@echo off
echo Starting AI Talent Hub...

:: 1. Start the Flask Backend in a new window with a specific title
start "WorkforceBackend" cmd /c "cd src/Database && python Server.py"

:: 2. Start the React Frontend in the current window
:: This window becomes the 'Controller'. Closing it or pressing Ctrl+C will trigger the cleanup.
echo Starting React Vite Server...
call npm run dev

:: 3. Cleanup: When 'npm run dev' stops, kill the backend window
echo Closing all operations...
taskkill /FI "WINDOWTITLE eq WorkforceBackend*" /T /F >nul 2>&1

pause