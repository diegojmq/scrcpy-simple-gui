' Abre la app directamente con Electron, SIN ninguna ventana de consola.
Dim fso, sh, dir, exe
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
exe = dir & "\node_modules\electron\dist\electron.exe"
Set sh = CreateObject("WScript.Shell")
sh.CurrentDirectory = dir
If fso.FileExists(exe) Then
  ' Modo 1 = ventana normal. Electron es app grafica (sin consola), asi que se ve bien.
  sh.Run """" & exe & """ """ & dir & """", 1, False
Else
  ' Primera vez: instalar dependencias (muestra consola solo esta vez)
  sh.Run "cmd /c npm ci && """ & exe & """ """ & dir & """", 1, False
End If
