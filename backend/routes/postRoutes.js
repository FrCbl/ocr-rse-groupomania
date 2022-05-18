// import d'express  et creation du router
const express = require('express');
const router = express.Router();

// import des middleware (ici, les authentifications, et permettre une gestion de fichiers)
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const multer = require('../middleware/multer-config');

// import des controllers
const postCtrl = require('../controllers/postsCtrl');
const likeCtrl = require('../controllers/likesCtrl');
const commentCtrl = require('../controllers/commentsCtrl');


// routes dans le router + authentification pour protection
// ensemble du CRUD pour publications
router.post('/', auth, multer, postCtrl.createPost);
router.get('/', auth, postCtrl.listPosts );
router.delete('/:postId', auth, adminAuth.authPost, postCtrl.deletePost);
// les routes liker, ou les obtenir, sur publications
router.get('/:postId/likes', auth, likeCtrl.getLikes );
router.post('/:postId/like', auth, likeCtrl.likePost );
// les routes pour les commentaires
router.get('/:postId/comments', auth, commentCtrl.getComments);
router.post('/:postId/comment', auth, commentCtrl.createComment);
router.delete('/comment/:commentId', auth, adminAuth.authComment, commentCtrl.deleteComment);


module.exports = router;