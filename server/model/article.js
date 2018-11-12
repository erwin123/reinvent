var db = require('../connection/dbconnection');
db.connect(db.trx,(done)=>{});

exports.getAllArticle = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('SELECT Id, ArticleCode, Title, Text, Status, Shared, Viewed, CreatedBy, CreatedDate FROM Article', function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getAllArticleByCriteria = function (Article, done) {
    var wh = db.whereCriteriaGenerator(Article);
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query("SELECT Id, ArticleCode, Title, Text, Status, Shared, Viewed, CreatedBy, CreatedDate FROM Article"+wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.insertArticle = function (Article, done) {
    var values = [Article.Title,Article.Text,Article.Status,Article.Shared,Article.Viewed,Article.CreatedBy];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_ArticleGenerator(?,?,?,?,?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.updateArticle = function (Article, done) {
    var values = [Article.Title,Article.Text,Article.Status,Article.Shared,Article.Viewed,Article.CreatedBy,Article.ArticleCode]
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('UPDATE Article SET Title=?,Text=?,Status=?,Shared=?,Viewed=?,CreatedBy=? where ArticleCode=?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}

exports.deleteArticle = function (key, done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('DELETE FROM Article where ArticleCode=?', key, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}


exports.getAllArticleFeedByCriteria = function (Article, done) {
    var wh = db.whereCriteriaGenerator(Article);
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query("SELECT Id, ArticleCode, Title, Text, Status, Shared, Viewed, CreatedBy, CreatedDate, UserCode,CategoryCode FROM FeederArticle"+wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getAllMediaArticle = function (Media, done) {
    var wh = db.whereCriteriaGenerator(Media);
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query("SELECT Id, ArticleCode,MediaPath, MediaType FROM MediaArticle"+wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}