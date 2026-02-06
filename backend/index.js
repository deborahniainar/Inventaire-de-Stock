const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialiser le fichier JSON s'il n'existe pas
function initDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {};
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Lire les données depuis le fichier JSON
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

// Écrire les données dans le fichier JSON
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Initialiser au démarrage
initDataFile();

// Routes

// GET /api/articles/:articleName/designations - Récupérer toutes les désignations d'un article
app.get('/api/articles/:articleName/designations', (req, res) => {
  const articleName = decodeURIComponent(req.params.articleName);
  const data = readData();
  
  if (!data[articleName]) {
    data[articleName] = [];
    writeData(data);
  }
  
  res.json(data[articleName]);
});

// POST /api/articles/:articleName/designations - Ajouter une désignation à un article
app.post('/api/articles/:articleName/designations', (req, res) => {
  try {
    const articleName = decodeURIComponent(req.params.articleName);
    const designation = req.body || {};
    
    const data = readData();
    
    if (!data[articleName]) {
      data[articleName] = [];
    }
    
    const ids = data[articleName].map(d => d.id).filter(Boolean);
    const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    
    const inv = Number(designation.inventaire);
    const inventaire = isNaN(inv) ? 0 : inv;
    const si = Number(designation.stockInitial);
    const stockInitial = isNaN(si) ? inventaire : si;
    
    const newDesignation = {
      id: newId,
      code: String(designation.code || ''),
      designation: String(designation.designation || ''),
      marque: String(designation.marque || ''),
      unite: String(designation.unite || ''),
      stockInitial,
      inventaire,
      entrees: Number(designation.entrees) || 0,
      sorties: Number(designation.sorties) || 0,
      stock: Number(designation.stock) || inventaire
    };
    
    data[articleName].push(newDesignation);
    writeData(data);
    
    res.status(201).json(newDesignation);
  } catch (err) {
    console.error('POST designations error:', err);
    res.status(500).json({ error: 'Erreur serveur lors de l\'ajout', details: err.message });
  }
});

// PUT /api/articles/:articleName/designations/:id - Mettre à jour une désignation
app.put('/api/articles/:articleName/designations/:id', (req, res) => {
  const articleName = decodeURIComponent(req.params.articleName);
  const id = req.params.id;
  const updatedData = req.body;
  
  const data = readData();
  
  if (!data[articleName]) {
    return res.status(404).json({ error: 'Article not found' });
  }
  
  const index = data[articleName].findIndex(d => d.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Designation not found' });
  }
  
  data[articleName][index] = {
    ...data[articleName][index],
    ...updatedData,
    id: parseInt(id)
  };
  
  // Recalculer le stock final: inventaire + entrées - sorties
  const designation = data[articleName][index];
  designation.stock = (Number(designation.inventaire) || 0) + (Number(designation.entrees) || 0) - (Number(designation.sorties) || 0);
  
  writeData(data);
  res.json(data[articleName][index]);
});

// DELETE /api/articles/:articleName/designations/:id - Supprimer une désignation
app.delete('/api/articles/:articleName/designations/:id', (req, res) => {
  const articleName = decodeURIComponent(req.params.articleName);
  const id = req.params.id;
  
  const data = readData();
  
  if (!data[articleName]) {
    return res.status(404).json({ error: 'Article not found' });
  }
  
  const index = data[articleName].findIndex(d => d.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Designation not found' });
  }
  
  data[articleName].splice(index, 1);
  writeData(data);
  
  res.json({ message: 'Designation deleted successfully' });
});

// POST /api/articles/:articleName/designations/:id/movements - Ajouter des mouvements (dates + E/S)
app.post('/api/articles/:articleName/designations/:id/movements', (req, res) => {
  try {
    const articleName = decodeURIComponent(req.params.articleName);
    const id = parseInt(req.params.id);
    const { movements } = req.body || {};
    if (!Array.isArray(movements) || movements.length === 0) {
      return res.status(400).json({ error: 'Body must contain movements array' });
    }
    const data = readData();
    if (!data[articleName]) {
      return res.status(404).json({ error: 'Article not found' });
    }
    const index = data[articleName].findIndex(d => d.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Designation not found' });
    }
    const d = data[articleName][index];
    if (!d.movements) d.movements = [];
    let addEntrees = 0;
    let addSorties = 0;
    movements.forEach(m => {
      const entree = Number(m.entree) || 0;
      const sortie = Number(m.sortie) || 0;
      addEntrees += entree;
      addSorties += sortie;
      d.movements.push({
        date: m.date || new Date().toISOString().slice(0, 10),
        entree,
        sortie
      });
    });
    d.entrees = (Number(d.entrees) || 0) + addEntrees;
    d.sorties = (Number(d.sorties) || 0) + addSorties;
    d.stock = (Number(d.inventaire) || 0) + d.entrees - d.sorties;
    writeData(data);
    res.json(d);
  } catch (err) {
    console.error('POST movements error:', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// PUT /api/articles/:articleName/designations/:id/movements - Remplacer tous les mouvements (édition)
app.put('/api/articles/:articleName/designations/:id/movements', (req, res) => {
  try {
    const articleName = decodeURIComponent(req.params.articleName);
    const id = parseInt(req.params.id);
    const { movements } = req.body || {};
    if (!Array.isArray(movements)) {
      return res.status(400).json({ error: 'Body must contain movements array' });
    }
    const data = readData();
    if (!data[articleName]) {
      return res.status(404).json({ error: 'Article not found' });
    }
    const index = data[articleName].findIndex(d => d.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Designation not found' });
    }
    const d = data[articleName][index];
    const normalized = movements.map(m => ({
      date: m.date || new Date().toISOString().slice(0, 10),
      entree: Number(m.entree) || 0,
      sortie: Number(m.sortie) || 0
    }));
    d.movements = normalized;
    d.entrees = normalized.reduce((s, m) => s + m.entree, 0);
    d.sorties = normalized.reduce((s, m) => s + m.sortie, 0);
    d.stock = (Number(d.inventaire) || 0) + d.entrees - d.sorties;
    writeData(data);
    res.json(d);
  } catch (err) {
    console.error('PUT movements error:', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

// GET /api/articles - Récupérer la liste de tous les articles
app.get('/api/articles', (req, res) => {
  const data = readData();
  const articles = Object.keys(data);
  res.json(articles);
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
