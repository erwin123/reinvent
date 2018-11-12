var db = require('../connection/dbconnection');
db.connect(db.trx,(done)=>{});

exports.getAllCategory = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('SELECT Id,CategoryName, CategoryCode, Thumbnail from Category', function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getAllCategoryByCriteria = function (Category, done) {
    var wh = db.whereCriteriaGenerator(Category);
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query("SELECT Id,CategoryName, CategoryCode, Thumbnail from Category"+wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.insertCategory= function (Category, done) {
    var values = [Category.CategoryName,Category.CategoryCode,Category.Thumbnail];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_CategoryGenerator(?,?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.updateCategory = function (Category, done) {
    var values = [Category.CategoryName,Category.Thumbnail,Category.CategoryCode];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('UPDATE Category SET CategoryName=?,Thumbnail=? where CategoryCode=?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}

exports.deleteCategory = function (key, done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('DELETE FROM Category where CategoryCode=?', key, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}



//user category-------------------------------------------------------------

exports.getAllUserCategory = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('SELECT Id,UserCode, CategoryCode from UserCategory', function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getAllUserCategoryByCriteria = function (UserCategory, done) {
    var wh = db.whereCriteriaGenerator(UserCategory);
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query("SELECT Id,UserCode, CategoryCode from UserCategory"+wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.insertUserCategory= function (UserCategory, done) {
    var values = [UserCategory.CategoryCode,UserCategory.UserCode];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_UserCategoryGenerator(?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.deleteUserCategory = function (key1,key2, done) {
    var values = [key1,key2];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('DELETE FROM UserCategory where CategoryCode=? AND UserCode=?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}