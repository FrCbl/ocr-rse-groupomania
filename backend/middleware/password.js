// import package password-validator
const passwordValid = require('password-validator');

// schema de validation du mdp avec propriétés
const passwordSchema = new passwordValid();
passwordSchema
.is().min(5)
.is().max(50)
.has().not().spaces()

module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
        next();
    } else {
        return res.status(400).json({ error : "Les exigences requises du mot de passe ne sont pas atteintes ! " + passwordSchema.validate('req.body.password', { list: true })})
    }
}