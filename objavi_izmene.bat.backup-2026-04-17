@echo off
set /p commit_msg="Unesite opis izmene (commit message): "
if "%commit_msg%"=="" set commit_msg="update"

echo.
echo Dodajem fajlove...
git add .

echo.
echo Komitujem izmene...
git commit -m "%commit_msg%"

echo.
echo Saljem na GitHub (matrix2-cista)...
git push origin matrix-v2-upgrade:matrix2-cista --force

echo.
echo Gotovo!
pause
