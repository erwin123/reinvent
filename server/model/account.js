var db = require('../connection/dbconnection');
db.connect(db.trx,(done)=>{});

exports.getAllAccount = function (done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('SELECT Id,Username,PasswordSalt,PasswordHash,LastLogin,Status,AddedBy FROM Account', function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.getAllAccountByCriteria = function (Account, done) {
    var wh = db.whereCriteriaGenerator(Account);
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query("SELECT Id,Username,PasswordSalt,PasswordHash,LastLogin,Status,AddedBy FROM Account"+wh, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.insertAccount = function (Account, done) {
    var values = [Account.Username,Account.Password,Account.AddedBy];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_AccountGenerator(?,?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.updateAccount = function (Account, done) {
    var values = [Account.Username,Account.Password];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_AccountUpdate(?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}

exports.deleteAccount = function (key, done) {
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('DELETE FROM Account where Username=?', key, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result)
        })
    })
}



//auth

exports.login = function (username, password, done) {
    var values = [username, password];
    db.get(db.trx, function (err, connection) {
        if (err) {
            return done('Database problem');
        }
        connection.query('CALL sp_Login(?, ?)',values, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.lastLogin = function (username, done) {
    db.get(db.trx, function (err, connection) {
        if (err) {
            return done('Database problem');
        }
        connection.query('UPDATE Account SET LastLogin=NOW() WHERE Username=?',username, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.lastLogin = function (username, done) {
    db.get(db.trx, function (err, connection) {
        if (err) {
            return done('Database problem');
        }
        connection.query('UPDATE Account SET LastLogin=NOW() WHERE Username=?',username, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}

exports.register = function (Account, done) {
    var values = [Account.Username,Account.Password,Account.AddedBy];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_AccountGenerator(?,?,?)', values, function (err, result) {
            connection.release();
            if (err) return done(err)
            done(null, result[0])
        })
    })
}

exports.changePassword = function (username, password, done) {
    var values = [username, password];
    db.get(db.trx, function (err, connection) {
        if (err) return done('Database problem')
        connection.query('CALL sp_AccountUpdate(?, ?)',values, function (err, rows) {
            connection.release();
            if (err) return done(err)
            done(null, rows)
        })
    })
}