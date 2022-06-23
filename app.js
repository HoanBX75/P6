const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/user');
const sauceRoutes= require('./routes/sauce');


// Getting environment parameters 
// -------------------------------
const dotenv = require("dotenv");
dotenv.config();
const MY_CONNECT =  process.env.MY_CONNECT;
console.log ("MY_CONNECT ", MY_CONNECT);

// Connect to mongodb 
//--------------------

mongoose.connect(MY_CONNECT,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));




const app = express();

// Allow cross origin, methods, and header attributes 
// -------------------------------------------------
 
app.use((req, res, next) => {
    console.log ("apps.js : authorizations ");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


// Express Json   

app.use(express.json());


// gestion de requête vers le dossier images/-- chemin d'accès absolu.
app.use('/images', express.static(path.join(__dirname, 'images')));


// Routes 
// ------


app.use('/api/auth/', userRoutes);
app.use('/api/sauces/', sauceRoutes);


/*
app.use('/api/auth/', userRoutes);
app.use('/api/sauces/', sauceRoutes);
app.use('/api/sauce/:id/like', sauceRoutes);
*/
/*
app.use((req, res) => {
   res.json({ message: 'Hello, Votre requête a bien été reçue !!' }); 
});
*/

module.exports = app;
