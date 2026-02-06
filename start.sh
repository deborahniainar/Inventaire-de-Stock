#!/bin/bash

echo "========================================"
echo "  Démarrage de l'application"
echo "  Gestion de Stock"
echo "========================================"
echo ""

echo "[1/4] Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERREUR: Node.js n'est pas installé !"
    echo "Veuillez installer Node.js depuis https://nodejs.org/"
    exit 1
fi
echo "Node.js version: $(node --version)"
echo ""

echo "[2/4] Installation des dépendances du backend..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installation en cours..."
    npm install
else
    echo "Mise à jour des dépendances..."
    npm install
fi
cd ..
echo ""

echo "[3/4] Installation des dépendances du frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installation en cours..."
    npm install
else
    echo "Mise à jour des dépendances..."
    npm install
fi
cd ..
echo ""

echo "[4/4] Démarrage des serveurs..."
echo "Démarrage du backend..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

sleep 5

echo "Démarrage du frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

sleep 5

echo ""
echo "========================================"
echo "  Les serveurs ont été lancés !"
echo "========================================"
echo "  Backend:  http://localhost:3000"
echo "  Frontend: http://localhost:5173"
echo "========================================"
echo ""

# Ouvrir le navigateur
echo "Ouverture du navigateur..."
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173
elif command -v open &> /dev/null; then
    open http://localhost:5173
elif command -v start &> /dev/null; then
    start http://localhost:5173
fi

echo ""
echo "Application lancée avec succès !"
echo "Appuyez sur Ctrl+C pour arrêter les serveurs"

# Fonction pour arrêter les serveurs proprement
cleanup() {
    echo ""
    echo "Arrêt des serveurs..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Serveurs arrêtés."
    exit 0
}

# Capturer Ctrl+C
trap cleanup INT TERM

# Attendre indéfiniment
wait
