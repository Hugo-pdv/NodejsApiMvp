-- Création de la table produits si elle n'existe pas déjà
CREATE TABLE IF NOT EXISTS produits (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  quantity INTEGER DEFAULT 0 NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 