// imports nécessaires
const path = require('path');
require('dotenv').config({ path: process.cwd() + './.env' });
const express = require('express');
const mysql = require('mysql2');

// middleware configuration BDD requis pour pouvoir y faire appel
require('./middleware/configuration-bdd.js');
const helmet = require('helmet');
const cors = require('cors');

//import de mes routes utilisateur et publication
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

//Appel de la méthode express
const app = express();

app.use(cors());
app.use(helmet());
//Prévention des erreurs CORS
 app.use((req, res, next) => {
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
     res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
     next();
 });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Enregistrement des routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

//Export de l'application express
module.exports = app;