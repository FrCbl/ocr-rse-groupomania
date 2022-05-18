// imports nécessaires
const db = require('../middleware/configuration-bdd');
const fs = require('fs');

// pouvoir créer une publication (POST)
exports.createPost = (req, res, next) => {
    const userId = req.auth.userId;
    
    const PJ = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;
    const title = req.body.title ? req.body.title : null;
    const content = req.body.content ? req.body.content : null;
    const likes = 0;

    const sql = "INSERT INTO POSTS (user_id, PJ, title, content, likes) VALUES (?, ?, ?, ?, ?);";
    const sqlParams = [userId, PJ, title, content, likes];
    db.query(sql, sqlParams, (error, results, fields) => {
        if(error) {
            res.status(500).json({'error': error.sqlMessage});
        } else {            
            res.status(201).json({message : "Post publié !", post: {postId:results.insertId, userId, PJ, title, content, likes} });
        }
    });

};

//obtenir la liste des publications triées par date décroisssante (GET)
exports.listPosts = (req, res, next) => {
    const sql = 
        "SELECT USERS.pseudo, USERS.avatar, POSTS.postId, POSTS.title, POSTS.content, POSTS.PJ, POSTS.user_id, POSTS.likes, POSTS.creationDate \
        FROM POSTS \
            LEFT JOIN USERS \
                ON POSTS.user_id = USERS.userId \
        ORDER BY creationDate DESC";
    db.query(sql, (error, results, field) => {
        if(error) {
            console.error(error)
            return res.status(400).json({ 'error': error.sqlMessage });
        }
        res.status(200).json({
            posts : results})
    });
};

// supprimer une publication (DELETE)
exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    
    const sqlParams = [postId];    
    const sqlDeleteImg = "SELECT * FROM POSTS WHERE postId= ?;"
    db.query(sqlDeleteImg, sqlParams, (errImg, results, fields) => {
        if(errImg) {
            res.status(500).json({ 'error': errImg.sqlMessage})            
        } else if(results[0].PJ != null) { // suppression de l'image
            const oldImg = results[0].PJ
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
        const sql = "DELETE FROM POSTS WHERE postId= ?;"; // suppression de la publication
        db.query(sql, sqlParams, (error, result, fields) => {
            if(error) {
                res.status(400).json({ 'error': error.sqlMessage});
            } else {
                res.status(201).json({ message: 'Post supprimé !'});
            }
        });
    })
};

// lister les commentaires d'une publication précise (GET)
exports.getAllComPosts = (req, res, next) => {
    const sql = 
    "SELECT p.title AS post_title, p.PJ AS post_PJ, p.creationDate AS post_creationDate, p.content AS post_content, \
        c.userId AS comment_userId, c.creationDate AS comment_creationDate, c.content AS comment_content, u.avatar AS comment_author_avatar \
        u.pseudo AS comment_author \
    FROM POSTS p \
    JOIN COMMENTS c ON p.postId = c.postId \
    JOIN USERS ON u.userId = c.userId;";
    db.query(sql, (error, result, fields) => {
        if (error) {
            res.status(500).json({'error': error.sqlMessage});
        }
        res.status(200).json(result);
    });
};
