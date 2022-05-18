// import de jwt - obtention/verification token
const jwt = require('jsonwebtoken');
require('dotenv').config();

// mon middleware d'authentification
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // récupération d'un token
        const decodedToken = jwt.verify(token, process.env.MY_SECRET_TOKEN_KEY_P2); //on décode avec la fonction verify en passant le token et la clé secrète        
        const userId = decodedToken.userId; //récupération de l'identifiant utilisateur        
        req.auth = { userId }; // ajout de l'identifiant utilisateur du token à l'objet requête
        
        if (req.body.userId && req.body.userId !== userId) { // comparaison identifiant utilisateur de la requête et celui du token
            throw 'User ID non valide !';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !'});
    }
};