@echo off
echo Starting backend with debugging...
cd backend
echo Backend directory: %CD%
echo.
echo Installing/updating dependencies...
npm install
echo.
echo Starting server...
npm start
