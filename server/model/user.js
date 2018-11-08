var db = require('../connection/dbconnection');
db.connect(db.trx,(done)=>{});

exports.getAllUser = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('SELECT Id,Username,FirstName,LastName,BirthDate,Gender,Phone,Address,Photo FROM User', function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getAllUserByCriteria = function (User, done) {
    var wh = db.whereCriteriaGenerator(User);
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query("SELECT Id,Username,FirstName,LastName,BirthDate,Gender,Phone,Address,Photo FROM User"+wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.insertUser = function (User, done) {
    var values = [User.Username,User.FirstName,User.LastName,User.BirthDate,User.Gender,User.Phone,User.Address,User.Photo];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_UserGenerator(?,?,?,?,?,?,?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.updateUser = function (User, done) {
    var values = [User.FirstName,User.LastName,User.BirthDate,User.Gender,User.Phone,User.Address,User.Photo,User.Username]
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('UPDATE User SET FirstName=?,LastName=?,BirthDate=?,Gender=?,Phone=?,Address=?,Photo=? where Username=?', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}

exports.deleteUser = function (key, done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('DELETE FROM User where Username=?', key, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}
