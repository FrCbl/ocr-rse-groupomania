//imports requis, variables d'envrionnements et mysql
require("dotenv").config();
const mysql = require('mysql2');

//mes variables nécessaires à la connexion récupérés du fichier de config
const MY_BDD_HOST = process.env.MY_BDD_HOST_P2;
const MY_BDD_USER = process.env.MY_BDD_USER_P2;
const MY_BDD_NAME = process.env.MY_BDD_NAME_P2;
const MY_BDD_PASS = process.env.MY_BDD_PASS_P2;

if(!MY_BDD_HOST) {
    throw new Error('Hôte, pour la connexion à la base de données, non configuré !');
} else {
    if (!MY_BDD_USER) {
        throw new Error('Utilisateur, pour la connexion à la base de données, non configuré !');
    } else {
        if(!MY_BDD_NAME) {
            throw new Error('Nom de base de données, pour la connexion, non configuré !');
        } else {
            if(!MY_BDD_PASS) {
                throw new Error('Mot de passe utilisateur, pour la connexion à la base de données, non configuré !');
            }
        }
    }
}

// création connexion à la bdd
const db = mysql.createConnection({
    host : MY_BDD_HOST,    
    database : MY_BDD_NAME,
    user : MY_BDD_USER,
    password : MY_BDD_PASS,
    multipleStatements: true,
    connectionLimit: 10
});

// tentative de connexion à la base mysql
db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('Connexion faite à la base de données !');
});

// export de la connexion à la base mysql
module.exports = db;


