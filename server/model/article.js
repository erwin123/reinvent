var db = require('../connection/dbconnection');
db.connect(db.trx, (done) => { });

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

exports.globalSearch = function (search, done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_GlobalSearch(?);',search, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows[0])
        })
    })
}

exports.getAllArticleLastMonth = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('SELECT Id, ArticleCode, Title, Text, Status, Shared, Viewed, CreatedBy, CreatedDate FROM Article WHERE CreatedDate BETWEEN (CURRENT_DATE() - INTERVAL 1 MONTH) AND (CURRENT_DATE() + INTERVAL 1 DAY);', function (err, rows) {
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
        connection.query("SELECT Id, ArticleCode, Title, Text, Status, Shared, Viewed, CreatedBy, CreatedDate FROM Article" + wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getAllArticleFeed = function (Article, Limit, LastId, Up, done) {
    var limit = Up === '1'? db.takeUpLimit(Limit, LastId):db.takeDownLimit(Limit, LastId);
    var wh = "";
    if (!isEmpty(Article)) {
        wh = db.whereCriteriaGenerator(Article) + limit;
    }else{
        wh = limit.toString().replace("and","where ");
    }
    
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query("SELECT Id, ArticleCode, Title, Text, Status, Shared, Viewed, CreatedBy, CreatedDate FROM Article" + wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.insertArticle = function (Article, done) {
    var values = [Article.Title, Article.Text, Article.Status, Article.Shared, Article.Viewed, Article.CreatedBy];
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
    var values = [Article.Title, Article.Text, Article.Status, Article.Shared, Article.Viewed, Article.CreatedBy, Article.ArticleCode]
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
        connection.query("SELECT Id, ArticleCode, Title, Text, Status, Shared, Viewed, CreatedBy, CreatedDate, UserCode,CategoryCode FROM FeederArticle" + wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getAllLikeArticle = function (ArticleLike, done) {
    var wh = db.whereCriteriaGenerator(ArticleLike);
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query("SELECT a.Id, a.ArticleCode,a.UserCode,b.FirstName, b.LastName FROM ArticleLikes a INNER JOIN User b ON a.UserCode = b.UserCode " + wh, function (err, rows) {
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
        connection.query("SELECT Id, ArticleCode,MediaPath, MediaType FROM MediaArticle" + wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.insertArticleCategory = function (ArticleCategory, done) {
    var values = [ArticleCategory.CategoryCode, ArticleCategory.ArticleCode];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_ArticleCategoryGenerator(?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.insertArticleLikes = function (ArticleLike, done) {
    var values = [ArticleLike.UserCode, ArticleLike.ArticleCode];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_ArticleLikesGenerator(?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.insertMediaArticle = function (MediaArticle, done) {
    var values = [MediaArticle.MediaType, MediaArticle.MediaPath, MediaArticle.ArticleCode];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_MediaArticleGenerator(?,?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.deleteArticleCategory = function (catCode, artCode, done) {
    var values = [catCode, artCode];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('DELETE FROM ArticleCategory where CategoryCode = ? AND ArticleCode=?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.deleteArticleLikes = function (articleCode, userCode, done) {
    var values = [articleCode, userCode];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('DELETE FROM ArticleLikes where ArticleCode = ? AND UserCode=?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}