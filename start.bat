@echo off
echo ========================================
echo   Demarrage de l'application
echo   Gestion de Stock
echo ========================================
echo.

echo [1/4] Verification de Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installe !
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js est installe.
echo.

echo [2/4] Installation des dependances du backend...
cd backend
if not exist "node_modules" (
    echo Installation en cours...
    call npm install
) else (
    echo Mise a jour des dependances...
    call npm install
)
cd ..
echo.

echo [3/4] Installation des dependances du frontend...
cd frontend
if not exist "node_modules" (
    echo Installation en cours...
    call npm install
) else (
    echo Mise a jour des dependances...
    call npm install
)
cd ..
echo.

echo [4/4] Demarrage des serveurs...
echo Demarrage du backend...
start "Backend Server" cmd /k "cd backend && npm start"
timeout /t 5 /nobreak >nul

echo Demarrage du frontend...
start "Frontend Server" cmd /k "cd frontend && npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   Les serveurs ont ete lances !
echo ========================================
echo   Backend:  http://localhost:3000
echo   Frontend: http://localhost:5173
echo ========================================
echo.
echo Ouverture du navigateur...
start http://localhost:5173

echo.
echo Application lancee avec succes !
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul
