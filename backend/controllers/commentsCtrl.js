const db = require('../middleware/configuration-bdd');

exports.createComment = (req, res, next) => {
    const content = req.body.content;
    const userId = req.auth.userId;
    const postId = req.params.postId;
    
    const sql = "INSERT INTO COMMENTS (content, userId, postId) VALUES (?, ?, ?);";
    const sqlParams = [content, userId, postId];
    db.query(sql, sqlParams, (error, result, fields) => {
        if(error) {
            res.status(500).json({'error': error.sqlMessage });
        }
        res.status(201).json({ message : 'Commentaire ajouté !'});
    });
};
exports.getComments = (req, res, next) => {
    const postId = req.params.postId;

    const sql = "SELECT commentId, content, COMMENTS.userId, DATE_FORMAT(creationDate, '%d/%m/%Y à %H:%i') creationDate, pseudo, avatar FROM COMMENTS JOIN  USERS ON COMMENTS.userId = USERS.userId WHERE COMMENTS.postId = ? ORDER BY creationDate DESC;";
    const sqlParams = [postId];
    db.query(sql, sqlParams, (error, results, fields) => {
        if (error) {
            res.status(500).json({ 'error': error.sqlMessage });
        }
        res.status(200).json(results);
    });
};
exports.deleteComment = (req, res, next) => {
    const commentId = req.params.commentId;
    const sql = "DELETE FROM COMMENTS WHERE commentId= ?;";
    const sqlParams = [commentId];
    db.query(sql, sqlParams, (error, result, fields) => {
        if(error) {
            res.status(500).json({ 'error': error.sqlMessage });
        }
        res.status(201).json({ message : 'Commentaire supprimé !'});
    });

};