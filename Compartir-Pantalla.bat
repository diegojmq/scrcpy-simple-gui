@echo off
REM Abre la app "Compartir Pantalla" (Electron) sin dejar consola abierta.
cd /d "%~dp0"
if not exist "node_modules\electron" (
  echo Instalando dependencias por primera vez ^(1-3 min^)...
  call npm install
)
start "" "node_modules\electron\dist\electron.exe" .
