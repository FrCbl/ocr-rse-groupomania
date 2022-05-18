// imports nécessaires
require('dotenv').config();
// packages nécessaires pour le projet ici : 
// de cryptage (bcrypt)
const bcrypt = require('bcrypt');
// création / vérification token
const jwt = require('jsonwebtoken');
// import de la connexion à la base de données
const db = require('../middleware/configuration-bdd');
//import de fs pour gestion fichiers
const fs = require('fs');

// permettre la création d'un compte (POST)
exports.signup = (req, res, next) => {
    //crypter le mdp avec hash 
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const pseudo = req.body.pseudo;
        const email = req.body.email;
        const password = hash;
     
        let droitsAdmin;
     
        const sqlCountUsers = `SELECT COUNT (*) AS usersNumber FROM USERS;`;
        db.query(sqlCountUsers, (error, resultc, fields) => {
            if (error) {
                console.log(error);
                res.status(500).json({'error': error.sqlMessage });
            } else {
                if (resultc[0].usersNumber === 0) {
                    droitsAdmin = 1;
                } else {
                    droitsAdmin = 0;
                }
                // mettre email en sqlParams
                const sqlEmail = `SELECT * FROM USERS WHERE email='${email}'`;
                db.query(sqlEmail, (err, results, rows) => {
                    if(results.length >0) {
                        return res.status(401).json({
                            message : 'Cet email est déjà enregistré !'
                        });
                    
                    } else {
                        const sqlCreate = ` INSERT INTO USERS (email, pseudo, password, droitsAdmin) VALUES (?, ?, ?, ?)`;
                        const sqlParams = [email, pseudo,  password, droitsAdmin];

                        db.query(sqlCreate, sqlParams, (error, result,fields) => {
                   
                            if(error) {
                                res.status(500).json({'erreur': error.sqlMessage});                       
                            } else {
                                res.status(201).json({ message : 'Profil utilisateur créé !'})
                            }
                        });
                    }
                });               
            }
        });
    })
    .catch(error => res.status(500).json({ error }));
};

// permettre de se connecter (POST)
exports.login = (req, res, next) => {
    const email = req.body.email;
    const sql = "SELECT userId, email, password, avatar, droitsAdmin \
                FROM USERS \
                WHERE email= ?";
    const sqlParams = [email];

    db.query(sql, sqlParams, (error, result, fields) => {
        // si erreur
        if(error) {
            res.status(500).json({'error': error.sqlMessage });
        // si utlisateur introuvable
        } else if(result.length == 0){
            res.status(401).json({ 'error' : 'Utilisateur introuvable !'});
        } else {
            bcrypt.compare(req.body.password, result[0].password)
            .then(valid => {
                if(!valid) {
                    return res.status(401).json({'error': 'Mot de passe erroné !'});
                } else (
                    res.status(200).json({
                        userId: result[0].userId,
                        token: jwt.sign(
                            { userId: result[0].userId },
                            process.env.MY_SECRET_TOKEN_KEY_P2,
                            { expiresIn: '24h'}
                        ),
                        pseudo: result[0].pseudo,
                        avatar: result[0].avatar,
                        droitsAdmin: result[0].droitsAdmin
                    })
                )
                
            })
            .catch(error => res.status(500).json({ error }));
        }
    })
};

//obtenir fiche d'un profil utilisateur (GET)
exports.getOneUser = (req, res, next) => {
    const userIdParam = req.params.userId;    
    const sql = "SELECT userId, pseudo, avatar, DATE_FORMAT(inscriptionDate, '%d/%m/%Y') inscriptionDate, droitsAdmin \
                FROM USERS \
                WHERE userId= ?";
    const sqlParams = [userIdParam];
    db.query(sql, sqlParams, (error, results, fields) => {
        if(error) {
            res.status(500).json({'error': error.sqlMessage});        
        } else if(results.length === 0) { 
            res.status(401).json({ 'error': "L'utilisateur n'existe pas !"});
        } else {
            res.status(200).json({user: results[0]})
        }
    })
};

// supprimer un profil utilisateur (DELETE)
exports.deleteAccount = (req, res, next) => {
    const userId = req.params.userId;
    const sql = "DELETE FROM USERS WHERE userId=?";
    const sqlParams = [userId];
    db.query(sql, sqlParams, (error, results, fields) => {
        if(error) {
            res.status(500).json({'error': error.sqlMessage});
        } else {
            res.status(201).json({ message : 'Compte supprimé !'});
        }
    });
};

// obtenir la liste des membres inscrits au réseau
exports.getAllUsers = (req, res, next) => {    
    const sql = "SELECT userID, pseudo, avatar \
                FROM USERS \
                ORDER by pseudo ASC;";
    db.query(sql, (error, results, fields) => {
        if(error) {
            res.status(500).json({'error': error.sqlMessage });
        } else (
            res.status(200).json({
                users : results,
                hostDir : `${req.protocol}://${req.get('host')}`
            })
        )
    });
};

// mise à jour de l'avatar de profil
exports.updateavatar = (req, res, next) => {
    const userId = req.params.userId;
    const sqlParams1 = [userId]
    const sqlDeleteImg = "SELECT * FROM USERS WHERE userId= ?";
    db.query(sqlDeleteImg, sqlParams1, (errImg, result, rows) => {
        if(errImg) {
            res.status(500).json({ 'error': errImg.sqlMessage })
        } else if (result[0].avatar != null) {
            const oldImg = result[0].avatar
            const oldFile = oldImg.split('/images/')[1];
            fs.unlink(`images/${oldFile}`, (err => {
                if(err) {
                    console.log(err);
                    return false
                } else {
                    return true
                }
            }));
        }
        const avatarUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;        
        const sqlUpdate = "UPDATE USERS SET avatar=? WHERE userId=?";
        const sqlParams = [avatarUrl, userId];
        db.query(sqlUpdate, sqlParams, (error, result, rows) => {
            if(error) {
                res.status(500).json({ 'error': error.sqlMessage });
            } else {
                res.status(201).json({ avatarUrl, userId, message: 'Avatar de profil modifié !'});
            }
        });
    })    
};

exports.authentificate = (req, res, next) => {
    res.status(200).json({ message: "Le jeton est valide !" })
};

