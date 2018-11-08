var account = require('../model/account');
var user = require('../model/user');
var express = require('express');
const https = require('https');
const jwt = require('jsonwebtoken');
var config = require('../config');
var router = express.Router();


router.get('/setcookie', function (req, res, next) {

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({ name: req.session.name });
});

router.get('/', function (req, res, next) {
    account.getAllAccount(function (err, rows) {
        if (err) { res.json(err); }
        else {
            res.json(rows);
        }
    });
});

router.post('/cr/', function (req, res, next) {
    if (req.body) {
        account.getAllAccountByCriteria(req.body, function (err, rows) {
            if (err) { res.json(err); }
            else { res.json(rows); }
        });
    }
});

router.post('/', function (req, res, next) {
    account.insertAccount(req.body, function (err, resultInsert) {
        if (err) { res.json(err); }
        else { res.json(resultInsert); }
    });
});

router.put('/:key', function (req, res, next) {
    account.updateAccount(req.params.key, req.body, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.delete('/:key', function (req, res, next) {
    account.deleteAccount(req.params.key, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});


//region account

router.post('/login/fb', function (req, res, next) {

    if (req.body.token) {
        //check token to fb
        let options = {
            host: "graph.facebook.com",
            path: '/' + req.body.userid + '?fields=id,name,first_name,last_name,email,picture&access_token=' + req.body.token,
            method: 'GET'
        };
        let reqFb = https.request(options, (resFb) => {
            resFb.setEncoding('utf8');
            resFb.on('data', (chunk) => {
                let obj = JSON.parse(chunk);
                account.getAllAccountByCriteria({ Username: obj.email }, (err, acc) => {
                    if (acc[0]) //exist user
                    {
                        req.session.name = req.body.token;
                        account.lastLogin(obj.email, (err, updateLogin) => {
                            res.setHeader('Content-Type', 'application/json');
                            res.status(200).send({ auth: true, token: req.body.token, username: req.body.username, orn: 'fb' });
                        })
                    } else {
                        req.session.name = req.body.token;
                        account.register({ Username: obj.email, Password: "fromfb", AddedBy: "facebook" }, (err, accReg) => {
                            res.setHeader('Content-Type', 'application/json');
                            res.status(200).send({ auth: true, token: req.body.token, username: req.body.username, orn: 'fb' });
                        });

                        user.insertUser({ Username: obj.email, FirstName: obj.first_name, LastName: obj.last_name, Photo: "https://graph.facebook.com/" + obj.id + "/picture?type=large" }, (err, addUser) => {

                        })
                    }
                })
            });
        });
        reqFb.end();
        reqFb.on('error', (e) => {
            res.status(401);
            res.send('Sorry, access not passed');
        });
    }
});

router.post('/login/g', function (req, res, next) {
    if (req.body.token) {
        //check token to google
        var headersOpt = {
            "content-type": "application/json",
        };
        let options = {
            host: "www.googleapis.com",
            path: '/oauth2/v3/tokeninfo?id_token=' + req.body.token,
            method: 'GET',
            headers: headersOpt,
            json: true
        };

        let reqG = https.request(options, (resG) => {
            resG.setEncoding('utf8');
            resG.on('data', (chunk) => {
                let obj = chunk;
                obj = JSON.parse(obj.toString().replace('typ": "JWT"','').substring(0,obj.length-5));
                account.getAllAccountByCriteria({ Username: obj.email }, (err, acc) => {
                    if (acc[0]) //exist user
                    {
                        req.session.name = req.body.token;
                        account.lastLogin(obj.email, (err, updateLogin) => {
                            res.setHeader('Content-Type', 'application/json');
                            res.status(200).send({ auth: true, token: req.body.token, username: req.body.username, orn: 'g' });
                        })
                    } else {
                        req.session.name = req.body.token;
                        account.register({ Username: obj.email, Password: "fromgoogle", AddedBy: "google" }, (err, accReg) => {
                            res.setHeader('Content-Type', 'application/json');
                            res.status(200).send({ auth: true, token: req.body.token, username: req.body.username, orn: 'g' });
                        });

                        user.insertUser({ Username: obj.email, FirstName: obj.given_name, LastName: obj.family_name, Photo: obj.picture }, (err, addUser) => {

                        })
                    }
                })
            });
        });
        reqG.end();
        reqG.on('error', (e) => {
            res.status(401);
            res.send('Sorry, access not passed');
        });
    } else {
        res.status(401);
        res.send('Sorry, access not passed');
    }
});

router.post('/login', function (req, res, next) {
    if (req.body) {
        account.login(req.body.username, req.body.password, function (err, rows, fields) {
            if (err) { res.status(500); res.send('Internal Server Error'); }
            else {
                if (rows[0][0]) {
                    // create a token
                    let token = jwt.sign({ username: req.body.username }, config.secret, {
                        expiresIn: 3600 // expires in 24 hours
                    });
                    let result = rows[0][0];

                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).send({ auth: true, token: token, username: req.body.username, g: false });
                }
                else {
                    res.status(401);
                    res.send('Sorry, access not passed');
                }
            }
        });
    }
});

router.post('/register', function (req, res, next) {
    if (req.body) {
        account.register(req.body.username, req.body.password, function (err, rows, fields) {
            if (err) {
                if (err.errno === 1062) {
                    res.status(200);
                    res.setHeader('Content-Type', 'application/json');
                    res.send({ "message": "Username already exist" });
                }
            }
            else {
                if (rows[0][0]) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(rows[0]));
                }
                else {
                    res.status(401);
                    res.send('Sorry, access not passed');
                }
            }

        });
    }
});

router.post('/changepwd', function (req, res, next) {
    if (req.body) {
        account.changePassword(req.body.username, req.body.password, function (err, rows, fields) {
            if (err) {
                res.status(500);
                res.setHeader('Content-Type', 'application/json');
                res.send({ "message": "Somethin Error" });
            }
            else {
                if (rows[0][0]) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(rows[0]));
                }
                else {
                    res.status(401);
                    res.send('Sorry, access not passed');
                }
            }

        });
    }
});
module.exports = router;