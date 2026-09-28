@echo off
REM Publica una version nueva en GitHub (arma el ZIP + sube codigo + crea el Release).
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0publicar.ps1"
