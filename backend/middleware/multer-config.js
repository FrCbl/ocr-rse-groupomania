// multer, pour la gestion d'images (ici, associé à une publication ou à un utilisateur (avatar de profil))
const multer = require('multer');

// types de fichier gérés
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg' : 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').split('.');
            name.pop();
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);        
    },
});

//export
module.exports = multer({storage: storage}).single("image");