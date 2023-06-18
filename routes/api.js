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
      res.status(500).json({message: error.message})
  }
})

// Route pour afficher un produit spécifique
router.get('/products/:id', async(req, res) =>{
  try {
      const {id} = req.params;
      const produit = await Produit.findById(id);
      res.status(200).json(produit);
  } catch (error) {
      res.status(500).json({message: error.message})
  }
})

// Route pour ajouter un produit
router.post('/products', async(req, res) => {
  try {
      const produit = await Produit.create(req.body)
      res.status(200).json(produit);
      
  } catch (error) {
      console.log(error.message);
      res.status(500).json({message: error.message})
  }
})

// Route pour mettre à jour un produit
router.put('/products/:id', async(req, res) => {
  try {
      const {id} = req.params;
      const produit = await Produit.findByIdAndUpdate(id, req.body);
      // Si le produit n'existe pas dans la base de données
      if(!produit){
          return res.status(404).json({message: `Impossible de trouver un produit avec l'ID ${id}`})
      }
      const updatedProduct = await Produit.findById(id);
      res.status(200).json(updatedProduct);
      
  } catch (error) {
      res.status(500).json({message: error.message})
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
      res.status(500).json({message: error.message})
  }
})

module.exports = router;

