# 📦 Inventaire de Stock

Application web complète de gestion d'inventaire de stock avec backend Node.js et frontend Vue.js. Interface moderne avec export Excel intégré incluant logo et mise en forme professionnelle.

## 📋 Prérequis

- Node.js (version 18 ou supérieure)
- npm (inclus avec Node.js)
- Un navigateur web moderne (Chrome, Firefox, Edge, Safari)

## 🚀 Démarrage rapide

**Le moyen le plus simple de démarrer l'application :**

### Windows
Double-cliquez sur le fichier `start.bat` ou exécutez dans PowerShell :
```powershell
.\start.bat
```

### Linux/Mac
Rendez le script exécutable puis lancez-le :
```bash
chmod +x start.sh
./start.sh
```

**Le script fera automatiquement :**
1. ✅ Vérification de Node.js
2. ✅ Installation/mise à jour des dépendances (npm install)
3. ✅ Démarrage du backend sur http://localhost:3000
4. ✅ Démarrage du frontend sur http://localhost:5173
5. ✅ Ouverture automatique du navigateur

## 📦 Installation manuelle (optionnelle)

Si c'est la première fois que vous lancez l'application, installez d'abord les dépendances :

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## 🛠️ Développement

### Démarrer le backend uniquement
```bash
cd backend
npm start
```

### Démarrer le frontend uniquement
```bash
cd frontend
npm run dev
```

## 📚 Fonctionnalités principales

### Gestion des stocks
- ✅ **12 catégories d'articles** prédéfinies
- ✅ **Gestion complète des désignations** (code, désignation, référence, marque, unité)
- ✅ **Suivi détaillé des stocks** :
  - Stock Initial (SI)
  - Inventaire
  - Entrées
  - Sorties
  - Stock Final (calculé automatiquement : SI + Entrées - Sorties)

### Interface utilisateur
- ✅ **Design moderne et responsive** avec Tailwind CSS
- ✅ **Filtrage par catégorie** via dropdown
- ✅ **Formulaires d'ajout et d'édition** intuitifs
- ✅ **Confirmation de suppression** pour éviter les erreurs
- ✅ **Gestion des mouvements** (entrées/sorties avec dates)

### Export Excel
- ✅ **Export professionnel** avec logo STC
- ✅ **Mise en forme complète** :
  - En-têtes colorés (bleu, vert, orange)
  - Cellules avec couleurs de fond
  - Bordures et alignement
- ✅ **Nom de fichier automatique** avec date

### Backend
- ✅ **API REST complète** avec Express.js
- ✅ **Stockage persistant** dans fichier JSON
- ✅ **CORS activé** pour le développement
- ✅ **Routes CRUD** pour articles et mouvements

## 🗂️ Structure du projet

```
Inventaire de Stock/
├── backend/           # Serveur API Express
│   ├── index.js       # Point d'entrée du backend
│   ├── data.json      # Base de données JSON
│   └── package.json
├── frontend/          # Application Vue.js
│   ├── src/
│   │   ├── App.vue    # Composant principal
│   │   ├── components/
│   │   └── main.js
│   └── package.json
├── start.bat          # Script de démarrage Windows
├── start.sh           # Script de démarrage Linux/Mac
├── .gitignore         # Fichiers à ignorer par Git
└── README.md          # Documentation
```

## 📊 Catégories disponibles

- APPAREIL SANITAIRE
- PORTE ET ACCESSOIRE
- ELECTRICITE
- CLIMATISEUR
- PLOMBERIE
- MATERIAUX DE CONSTRUCTION
- ACHAT LOCAL
- HABILLAGE
- ELECTRO-MENAGER
- MEUBLE ET ACCESSOIRE
- DECORATION
- PIECES DE RECHANGE

## 🔧 Technologies utilisées

**Frontend:**
- Vue 3
- Vite
- Tailwind CSS v3
- ExcelJS (export Excel)

**Backend:**
- Node.js
- Express
- CORS
- File System (stockage JSON)

## 🎨 Captures d'écran

### Interface principale
- Tableau de gestion avec toutes les colonnes
- Dropdown de sélection de catégorie
- Boutons d'action (Ajouter, Exporter, Éditer, Supprimer)

### Export Excel
- Fichier .xlsx avec logo intégré
- Mise en forme professionnelle avec couleurs
- Structure identique à la maquette fournie

## 🔒 Sécurité et bonnes pratiques

- ✅ Les `node_modules/` sont exclus du versionnement (`.gitignore`)
- ✅ Les données sont stockées localement dans `backend/data.json`
- ✅ CORS configuré pour le développement local
- ✅ Validation des données côté backend

## 🐛 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier que Node.js est installé
node --version

# Vérifier que les ports 3000 et 5173 sont libres
# Windows:
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Linux/Mac:
lsof -i :3000
lsof -i :5173
```

### Les dépendances ne s'installent pas
```bash
# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et réinstaller
rm -rf backend/node_modules frontend/node_modules
cd backend && npm install
cd ../frontend && npm install
```

## 📝 Licence

Ce projet est développé pour la gestion interne d'inventaire.

## 👥 Support

Pour toute question ou problème, veuillez créer une issue dans le repository Git.

---

**Développé avec ❤️ en Vue.js et Node.js**
