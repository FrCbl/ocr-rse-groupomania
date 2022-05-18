// import d'express  et creation du router
const express = require('express');
const router = express.Router();

// import des middlewares requis aux routes
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const adminAuth = require('../middleware/adminAuth');
const password = require('../middleware/password');
// import des controllers
const userCtrl = require('../controllers/usersCtrl');


// routes utilisateur dans le router
router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);

router.get('/profile/:userId', auth, userCtrl.getOneUser);
router.get('/auth', auth, userCtrl.authentificate);
router.get('/users/' , auth, userCtrl.getAllUsers);
router.put('/profile/:userId', auth, multer, userCtrl.updateavatar);
router.delete('/profile/:userId', auth ,userCtrl.deleteAccount);

// export du router
module.exports = router;