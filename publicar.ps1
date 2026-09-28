# ============================================================
#  Publicar una version nueva en GitHub (automatico)
#  - Arma el ZIP con el electron.exe ORIGINAL + Compartir Pantalla.vbs
#  - Sube el codigo (git push)
#  - Crea el Release y sube el ZIP (gh)
# ============================================================
param([string]$Version)
$ErrorActionPreference = "Stop"
$app = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $app

if (-not $Version) { $Version = Read-Host "Version a publicar (ej. 1.1.0)" }
$Version = $Version.Trim().TrimStart("v")
if (-not $Version) { Write-Host "Sin version. Cancelado."; return }

Write-Host "== 1) Verificando Electron =="
if (-not (Test-Path "$app\node_modules\electron\dist\electron.exe")) {
    Write-Host "Instalando dependencias (npm ci)..."
    npm ci
}

$scr = Join-Path (Split-Path $app -Parent) "scrcpy"
if (-not (Test-Path "$scr\scrcpy.exe")) { Write-Host "ERROR: no se encontro scrcpy en $scr"; return }

$out = "$app\dist\CompartirPantalla"
Write-Host "== 2) Armando la app (electron.exe original + app + scrcpy) =="
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory -Force -Path $out | Out-Null
Copy-Item "$app\node_modules\electron\dist\*" $out -Recurse -Force
Remove-Item "$out\resources\default_app.asar" -Force -ErrorAction SilentlyContinue

New-Item -ItemType Directory -Force -Path "$out\resources\app" | Out-Null
Copy-Item "$app\main.js","$app\preload.js","$app\package.json" "$out\resources\app\" -Force
Copy-Item "$app\renderer" "$out\resources\app\" -Recurse -Force

New-Item -ItemType Directory -Force -Path "$out\resources\scrcpy" | Out-Null
Copy-Item "$scr\*" "$out\resources\scrcpy\" -Recurse -Force
$quitar = @("dispositivo.txt","config.json","config.txt","gui-error.txt","scrcpy-gui.ps1",
    "Jugar-scrcpy.bat","Interfaz-scrcpy.bat","Interfaz.vbs","COMO-USAR.txt","Iniciar-Receptor.bat")
foreach ($q in $quitar) { Remove-Item "$out\resources\scrcpy\$q" -Force -ErrorAction SilentlyContinue }
Get-ChildItem "$out\resources\scrcpy" -Filter "Receptor-*" -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
Get-ChildItem "$out\resources\scrcpy" -Filter "*.lnk" -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

# Lanzador .vbs (usa el electron.exe original -> no lo detecta el antivirus)
$vbs = @'
Dim fso, sh, dir
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
Set sh = CreateObject("WScript.Shell")
sh.CurrentDirectory = dir
sh.Run """" & dir & "\electron.exe"" """ & dir & "\resources\app""", 1, False
'@
Set-Content -Path "$out\Compartir Pantalla.vbs" -Value $vbs -Encoding ASCII

Write-Host "== 3) Comprimiendo ZIP =="
$zip = "$app\dist\CompartirPantalla-$Version.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path $out -DestinationPath $zip -Force
Write-Host ("ZIP creado: {0} ({1:N0} MB)" -f $zip, ((Get-Item $zip).Length/1MB))

Write-Host "== 4) Subiendo codigo a GitHub (git push) =="
git add -A
git commit -m "Release v$Version"   # si no hay cambios, git avisa y sigue
git push

Write-Host "== 5) Creando el Release y subiendo el ZIP =="
$hash = (Get-FileHash $zip -Algorithm SHA256).Hash
$notes = "Descarga CompartirPantalla-$Version.zip, descomprimelo, abre la carpeta CompartirPantalla y ejecuta 'Compartir Pantalla.vbs'.`n`nUsa el electron.exe original, por lo que el antivirus normalmente no lo detecta. Codigo abierto, sin firma.`n`nSHA-256: $hash"
gh release create "v$Version" $zip --title "Compartir Pantalla v$Version" --notes $notes
if ($LASTEXITCODE -ne 0) {
    Write-Host "La version v$Version ya existe; subo el ZIP a la existente..."
    gh release upload "v$Version" $zip --clobber
}

Write-Host ""
Write-Host "==================================================="
Write-Host " LISTO. Publicado en:"
Write-Host " https://github.com/diegojmq/scrcpy-simple-gui/releases/tag/v$Version"
Write-Host "==================================================="
Read-Host "Pulsa Enter para cerrar"
