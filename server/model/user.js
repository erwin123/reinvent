var db = require('../connection/dbconnection');
db.connect(db.trx,(done)=>{});

exports.getAllUser = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('SELECT Id,Username,FirstName,LastName,BirthDate,Gender,Phone,Address,Photo,About, UserCode FROM User', function (err, rows) {
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
        connection.query("SELECT Id,Username,FirstName,LastName,BirthDate,Gender,Phone,Address,Photo,About, UserCode FROM User"+wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.insertUser = function (User, done) {
    var values = [User.Username,User.FirstName,User.LastName,User.BirthDate,User.Gender,User.Phone,User.Address,User.Photo,User.About];
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
    var values = [User.FirstName,User.LastName,User.BirthDate,User.Gender,User.Phone,User.Address,User.Photo,User.About,User.Username, User.UserCode]
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('UPDATE User SET FirstName=?,LastName=?,BirthDate=?,Gender=?,Phone=?,Address=?,Photo=?, About=?, Username=? where UserCode=?', values, function (err, result) {
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



//follow
exports.getAllFollowByCriteria = function (Follow, done) {
    var wh = db.whereCriteriaGenerator(Follow);
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query("SELECT Id, FollowerCode, UserCode FROM Follow"+wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.insertFollow = function (Follow, done) {
    var values = [Follow.UserCode,Follow.FollowerCode];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_FollowGenerator(?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.deleteFollow = function (key1,key2, done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('DELETE FROM Follow where UserCode=? AND FollowerCode=?', [key1,key2], function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}