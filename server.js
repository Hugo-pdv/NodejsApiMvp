
// Importation des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();

// Importation des routes de l'API
const apiRoutes = require('./routes/api'); 

// Utilisation des middlewares
app.use(cors()); 
app.use(bodyParser.json());
app.use('/api', apiRoutes);

// Connexion à MongoDB
const port = process.env.PORT || 5000;

mongoose.set("strictQuery", false)
mongoose.connect('mongodb+srv://admin:0404@apicrud.zr2mu49.mongodb.net/Node-API?retryWrites=true&w=majority')
  .then(() => {
      console.log('MongoDB Connected')
      app.listen(port, () => {
      console.log(`Server started on port ${port}`)
      });
  })
  .catch(err => console.log(err));





