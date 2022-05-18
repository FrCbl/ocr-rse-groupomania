const db = require('./configuration-bdd');

// profil ayant les droits administrateurs ou non?
exports.droitsAdmin = (req, res, next) => {
    const userId = req.auth.userId;

    const sql = "SELECT droitsAdmin FROM USERS WHERE userId=?;";
    const sqlParams = [userId];
    db.query(sql, sqlParams, (error, result, fields) => {
        if (error) {
            res.status(500).json({'error': error.sqlMessage });
        } else {
            if(result[0].droitsAdmin == 1) {
                next();
            } else {
                res.status(403).json({'error': 'Accès refusé !'});                
            }
        }
    });
};

// autorisation sur suppression d'une publication
exports.authPost = (req, res, next) => {
    const userId = req.auth.userId;
    const sql = "SELECT droitsAdmin FROM USERS WHERE userId = ?;";
    const sqlParams = [userId];
    db.query(sql, sqlParams, (error, result, fields) => {
        if (error) {
            res.status(500).json({'error': error.sqlMessage });
        } else {
            if(result[0].droitsAdmin == 1) { // profil administrateur
                next();
            } else {
                //user is not Admin
                const postId = req.params.postId;
                const sql2 = "SELECT user_id FROM POSTS WHERE postId=?;";
                const sqlParams2 = [postId];
                db.query(sql2, sqlParams2, (error, result, fields) => {
                    if(error) {
                        res.status(500).json({ 'error': error.sqlMessage });
                    } else if (result.length === 0) {
                        res.status(404).json({'error': "La publication est introuvable !"});
                    } else {
                        const postAuthor = result[0].user_id;
                        if (postAuthor === userId) { //l'utilisateur est l'auteur
                            next();
                        } else {
                            res.status(403).json({ 'error': 'Accès refusé !'});
                        }
                    }
                });
            }
        }
    });
};

// autorisation sur suppression d'un commentaire
exports.authComment = (req, res, next) => {
    const userId = req.auth.userId;

    const sql = "SELECT droitsAdmin FROM USERS WHERE userId= ?;";
    const sqlParams = [userId];

    db.query(sql, sqlParams, (error, result, fields) => {
        if( error ) {
            res.status(500).json({ 'error': error.sqlMessage});
        } else {
            if(result[0].droitsAdmin == 1) { //profil administrateur
                next();
            } else {
                const commentId = req.params.commentId;
                const sql2 = "SELECT userId FROM COMMENTS WHERE commentId = ?;";
                const sqlParams2 = [commentId];
                
                db.query(sql2, sqlParams2, (error, result, fields) => {
                    if(error) {
                        res.status(500).json({'error': error.sqlMessage});
                    } else if (result.length === 0) {
                        res.status(404).json({ 'error': "Le commentaire est introuvable !"});
                    } else {
                        const commAuthor = result[0].userId;
                        if (commAuthor === userId) { //l'utilisateur est commentateur
                            next();
                        } else {
                            res.status(403).json({ 'error': 'Accès refusé !'});
                        }
                    }
                });
            }
        } 
    });
};
exports.deleteUser = (req, res, next) => {
    const userId = req.params.userId;
    const currentUser = req.auth.userId;
    const sql = "SELECT droitsAdmin FROM USERS WHERE userId= ?;";
    const sqlParams = [userId];
    db.query(sql, sqlParams, (error, result, fields) => {
        if( error ) {
            res.status(500).json({ 'error': error.sqlMessage});
        } else {
            if(result[0] === 1) {
                next();
            } else if (currentUser === userId) {
                next();
            } else {
                res.status(403).json({'error': 'Accès refusé !'});
            }            
        }
    });
};