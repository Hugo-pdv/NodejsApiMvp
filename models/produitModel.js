const { pool } = require('../db/db');

class Produit {
  // Récupérer tous les produits
  static async find() {
    const result = await pool.query('SELECT * FROM produits ORDER BY created_at DESC');
    return result.rows;
  }

  // Récupérer un produit par son ID
  static async findById(id) {
    const result = await pool.query('SELECT * FROM produits WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Créer un nouveau produit
  static async create(productData) {
    const { name, quantity, price, image } = productData;
    
    // Validation des données
    if (!name) throw new Error("Le nom du produit est requis");
    
    // Convertir les valeurs numériques et gérer les champs vides
    const validatedQuantity = quantity === '' ? 0 : Number(quantity);
    
    // Valider que le prix est un nombre valide
    if (price === '' || isNaN(Number(price))) {
      throw new Error("Le prix doit être un nombre valide");
    }
    const validatedPrice = Number(price);
    
    const result = await pool.query(
      'INSERT INTO produits (name, quantity, price, image) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, validatedQuantity, validatedPrice, image || null]
    );
    return result.rows[0];
  }

  // Mettre à jour un produit
  static async findByIdAndUpdate(id, productData) {
    const { name, quantity, price, image } = productData;
    
    // Vérifier si le produit existe
    const existingProduct = await this.findById(id);
    if (!existingProduct) return null;
    
    // Validation des données
    if (!name) throw new Error("Le nom du produit est requis");
    
    // Convertir les valeurs numériques et gérer les champs vides
    const validatedQuantity = quantity === '' ? 0 : Number(quantity);
    
    // Valider que le prix est un nombre valide
    if (price === '' || isNaN(Number(price))) {
      throw new Error("Le prix doit être un nombre valide");
    }
    const validatedPrice = Number(price);
    
    // Mise à jour du produit
    const result = await pool.query(
      'UPDATE produits SET name = $1, quantity = $2, price = $3, image = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [name, validatedQuantity, validatedPrice, image || null, id]
    );
    return result.rows[0];
  }

  // Supprimer un produit
  static async findByIdAndDelete(id) {
    // Vérifier si le produit existe
    const existingProduct = await this.findById(id);
    if (!existingProduct) return null;
    
    // Suppression du produit
    const result = await pool.query('DELETE FROM produits WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Produit;