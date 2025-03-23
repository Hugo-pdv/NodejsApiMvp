// Importation des modules nécessaires
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Importation des modules de base de données
const { pool, initDB, runMigration } = require('./db/db');

const app = express();

// Importation des routes de l'API
const apiRoutes = require('./routes/api');

// Utilisation des middlewares
app.use(cors());
app.use(bodyParser.json());

// Ajout de middleware pour servir les fichiers statiques depuis le dossier public
app.use(express.static('public'));

// Utilisation des routes
app.use('/api', apiRoutes);

// Connexion à la BDD et démarrage du serveur
const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Initialiser la base de données
    await initDB();
    
    // Exécuter la migration pour augmenter la taille du champ image
    await runMigration();
    
    // Test de connexion
    const client = await pool.connect();
    console.log('PostgreSQL Connected');
    client.release();
    
    // Démarrer le serveur
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (err) {
    console.error('Erreur de connexion à PostgreSQL:', err.message);
    process.exit(1);
  }
};

// Exécuter la connexion
startServer();





