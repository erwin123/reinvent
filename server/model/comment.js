var db = require('../connection/dbconnection');
db.connect(db.trx,(done)=>{});

exports.getAllComment = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('SELECT Id,ArticleCode, Text, Status, CreatedBy, CreatedDate, CommentCode from Comment', function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getAllCommentByCriteria = function (Comment, done) {
    var wh = db.whereCriteriaGenerator(Comment);
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query("SELECT Id,ArticleCode, Text, Status, CreatedBy, CreatedDate, CommentCode from Comment"+wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.insertComment= function (Comment, done) {
    var values = [Comment.ArticleCode,Comment.Text,Comment.CreatedBy];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_CommentGenerator(?,?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.updateComment = function (Comment, done) {
    var values = [Comment.Text,Comment.CommentCode];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('UPDATE Comment SET Text=? where CommentCode=?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}

exports.deleteComment = function (key, done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('DELETE FROM Comment where CommentCode=?', key, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}
