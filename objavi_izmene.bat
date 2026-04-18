@echo off
REM ---------------------------------------------------------------
REM  objavi_izmene.bat - NOVA verzija (2026-04-17)
REM
REM  Sta radi:
REM   - commit-uje trenutne izmene
REM   - pusa TRENUTNU granu na matrix-v2-upgrade (LIVE grana)
REM   - NEMA --force (ako remote je ispred lokalnog, skripta STAJE)
REM   - NE push-uje na zombi grane (matrix2-cista, stars1, itd)
REM
REM  STARA VERZIJA (pre 2026-04-17) je imala:
REM     git push origin matrix-v2-upgrade:matrix2-cista --force
REM  -> pogresna grana, pogresan target, --force.
REM  Sacuvana u objavi_izmene.bat.backup-2026-04-17.
REM ---------------------------------------------------------------

setlocal

cd /d "C:\Users\djord\nastavak\palmoticeva-v2"
if errorlevel 1 (
  echo GRESKA: Ne mogu da udjem u radni folder.
  pause
  exit /b 1
)

echo === Trenutna grana ===
for /f %%b in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%b
echo %BRANCH%
echo.

if "%BRANCH%"=="HEAD" (
  echo GRESKA: Detached HEAD. Checkout-uj granu pre push-a.
  pause
  exit /b 1
)

echo === Status ===
git status
echo.

set /p COMMIT_MSG="Poruka za commit (Enter da preskocis commit): "

if not "%COMMIT_MSG%"=="" (
  git add -A
  git commit -m "%COMMIT_MSG%"
  if errorlevel 1 (
    echo GRESKA pri commit-u. Obustavljam.
    pause
    exit /b 1
  )
)

echo.
echo === Push na origin/matrix-v2-upgrade (BEZ --force) ===
echo     Lokalna grana: %BRANCH%
echo     Target:        matrix-v2-upgrade
echo.
set /p CONFIRM="Push ce deploy-ovati na LIVE backend palmoticeva-v2-1. Nastavi? (y/N): "

if /i not "%CONFIRM%"=="y" (
  echo Otkazano. Nista nije push-ovano.
  exit /b 0
)

git push origin %BRANCH%:matrix-v2-upgrade
if errorlevel 1 (
  echo.
  echo GRESKA pri push-u. Najcesce:
  echo   - remote je ispred tvoje grane -^> git pull origin matrix-v2-upgrade prvo
  echo   - konflikt -^> resi lokalno pa ponovo pokusaj
  pause
  exit /b 1
)

echo.
echo === Gotovo. Firebase App Hosting pocinje build. ===
echo     Prati u konzoli: https://console.firebase.google.com/project/palmoticeva-portal/apphosting
echo.
pause
endlocal
