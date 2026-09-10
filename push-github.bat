@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

echo === DevDict GitHub Push ===
echo.

rem read system proxy from registry
set "PROXY="
for /f "usebackq delims=" %%p in (`powershell -NoProfile -Command "(Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings').ProxyServer"`) do set "PROXY=%%p"
if defined PROXY (
  echo [proxy] %PROXY%
  git config http.proxy http://%PROXY%
  git config https.proxy http://%PROXY%
) else (
  echo [proxy] none, direct connection
  git config --unset http.proxy
  git config --unset https.proxy
)

rem ask for PAT (hidden input)
set "PAT="
for /f "usebackq delims=" %%t in (`powershell -NoProfile -Command "$s=Read-Host 'GitHub Personal Access Token' -AsSecureString; [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($s))"`) do set "PAT=%%t"
if not defined PAT (
  echo No token entered. Aborted.
  pause
  exit /b 1
)

echo.
echo Pushing branch main to JH0526/DevDict ...
git -c http.sslVerify=false push "https://%PAT%@github.com/JH0526/DevDict.git" main
set RC=%ERRORLEVEL%

echo.
if "%RC%"=="0" (
  echo [OK] pushed.
  git remote set-url origin https://github.com/JH0526/DevDict.git
  git config http.sslVerify true
) else (
  echo [FAIL] exit code %RC%
)
pause
