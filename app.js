const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
// const sauceRoutes= require('./routes/sauce');

const dotenv = require("dotenv");
dotenv.config();
const MY_CONNECT =  process.env.MY_CONNECT;
console.log ("MY_CONNECT ", MY_CONNECT);


// connection a MongoDB
// mongodb+srv://ochoan:ochoan@cluster0.kpc7n.mongodb.net/?retryWrites=true&w=majority
mongoose.connect(MY_CONNECT,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


/*
mongoose.connect('mongodb+srv://ochoan:ochoan@cluster0.kpc7n.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

*/


const app = express();

// Allow cross origin, methods, and header attributes 

app.use((req, res, next) => {
    console.log ("here in apps");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


// Express Json   

app.use(express.json());

// Routes 
app.use('/api/auth/', userRoutes);

/*
app.use('/api/auth/', userRoutes);
app.use('/api/sauces/', sauceRoutes);
app.use('/api/sauce/:id/like', sauceRoutes);
*/

app.use((req, res) => {
   res.json({ message: 'Hello, Votre requête a bien été reçue !!' }); 
});

module.exports = app;
