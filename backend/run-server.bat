@echo off
title Obsyra Production SQL Backend Server
color 0b
echo =======================================================
echo   OBSYRA PVT LTD - PRODUCTION SQL BACKEND SERVER
echo   Company: Obsyra Pvt Ltd (Reg: 16 Feb 2026, Wagholi Pune)
echo =======================================================
echo.
echo Starting Node.js Express REST API Server on http://localhost:3000/api...
echo.
cd /d "%~dp0"
node server.js
pause
