const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration de la connexion avec la chaine URL complète
// En mode transaction, les prepared statements doivent être désactivés
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  statement_timeout: 5000,
  query_timeout: 5000,
  // Désactiver les prepared statements car ils ne sont pas supportés en mode transaction
  prepared_statements: false
});

// Fonction pour initialiser la base de données
const initDB = async () => {
  try {
    const client = await pool.connect();
    
    // Lire le script SQL d'initialisation
    const initSQL = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    
    // Exécuter le script
    await client.query(initSQL);
    
    console.log('Base de données initialisée avec succès');
    client.release();
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    return false;
  }
};

// Fonction pour exécuter la migration
const runMigration = async () => {
  try {
    const client = await pool.connect();
    
    // Lire le script SQL de migration
    const migrationSQL = fs.readFileSync(path.join(__dirname, 'migration.sql'), 'utf8');
    
    // Exécuter le script
    await client.query(migrationSQL);
    
    console.log('Migration exécutée avec succès');
    client.release();
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    return false;
  }
};

module.exports = { pool, initDB, runMigration }; 