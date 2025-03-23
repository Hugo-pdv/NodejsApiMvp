// Importation des modules nécessaires
const express = require('express');
const router = express.Router();
const Produit = require('../models/produitModel')

// Route pour la page d'accueil
router.get('/', (req, res) => {
  res.send('Hello !')
})

// Route pour afficher tous les produits
router.get('/products', async(req, res) => {
  try {
      const produit = await Produit.find({});
      res.status(200).json(produit);
  } catch (error) {
      console.error('Erreur liste produits:', error.message);
      res.status(500).json({message: error.message})
  }
})

// Route pour afficher un produit spécifique
router.get('/products/:id', async(req, res) =>{
  try {
      const {id} = req.params;
      const produit = await Produit.findById(id);
      if (!produit) {
          return res.status(404).json({message: `Produit avec l'ID ${id} non trouvé`});
      }
      res.status(200).json(produit);
  } catch (error) {
      console.error('Erreur détail produit:', error.message);
      res.status(500).json({message: error.message})
  }
})

// Route pour ajouter un produit
router.post('/products', async(req, res) => {
  try {
      if (!req.body.name) {
          return res.status(400).json({message: 'Le nom du produit est requis'});
      }
      
      // Tenter de créer le produit avec validation dans le modèle
      const produit = await Produit.create(req.body);
      res.status(201).json(produit);
      
  } catch (error) {
      console.error('Erreur création produit:', error.message);
      // Retourner un statut 400 pour les erreurs de validation
      return res.status(400).json({message: error.message});
  }
})

// Route pour mettre à jour un produit
router.put('/products/:id', async(req, res) => {
  try {
      const {id} = req.params;
      
      if (!req.body.name) {
          return res.status(400).json({message: 'Le nom du produit est requis'});
      }
      
      const produit = await Produit.findByIdAndUpdate(id, req.body);
      
      // Si le produit n'existe pas dans la base de données
      if(!produit){
          return res.status(404).json({message: `Impossible de trouver un produit avec l'ID ${id}`})
      }
      
      const updatedProduct = await Produit.findById(id);
      res.status(200).json(updatedProduct);
      
  } catch (error) {
      console.error('Erreur mise à jour produit:', error.message);
      // Retourner un statut 400 pour les erreurs de validation
      return res.status(400).json({message: error.message});
  }
})

// Route pour supprimer un produit
router.delete('/products/:id', async(req, res) =>{
  try {
      const {id} = req.params;
      const produit = await Produit.findByIdAndDelete(id);
      if(!produit){
          return res.status(404).json({message: `Impossible de trouver un produit avec l'ID ${id}`})
      }
      res.status(200).json(produit);
      
  } catch (error) {
      console.error('Erreur suppression produit:', error.message);
      res.status(500).json({message: error.message})
  }
})

module.exports = router;

