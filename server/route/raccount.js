var account = require('../model/account');
var user = require('../model/user');
var express = require('express');
const https = require('https');
const jwt = require('jsonwebtoken');
var config = require('../config');
var router = express.Router();


router.get('/privatecookiecheck', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({ token: req.session.token, id:req.session.id, prv:req.session.prv });
});

router.get('/publiccookiecheck', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({ token: req.session.token, id:req.session.id, prv:req.session.prv });
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


//region account google and fb
router.post('/login/fb', function (req, res, next) {

    if (req.body.token) {
        //check token to fb
        let options = {
            host: "graph.facebook.com",
            path: '/' + req.body.id + '?fields=id,name,first_name,last_name,email,picture&access_token=' + req.body.token,
            method: 'GET'
        };
        let reqFb = https.request(options, (resFb) => {
            resFb.setEncoding('utf8');
            resFb.on('data', (chunk) => {
                let obj = JSON.parse(chunk);
                let photo = "https://graph.facebook.com/" + obj.id + "/picture?type=large"
                account.getAllAccountByCriteria({ Username: obj.email }, (err, acc) => {
                    if (acc[0]) //exist user
                    {
                        req.session.token = req.body.token;
                        req.session.id = req.body.id;
                        req.session.prv = "fb";
                        req.session.email = obj.email;
                        account.lastLogin(obj.email, (err, updateLogin) => {
                            res.setHeader('Content-Type', 'application/json');
                            res.status(200).send({ profilepic:photo, auth: true, username: req.body.username, orn: 'fb' });
                        })
                    } else {
                        req.session.token = req.body.token;
                        req.session.id = req.body.id;
                        req.session.prv = "fb";
                        req.session.email = obj.email;
                        account.register({ Username: obj.email, Password: "fromfb", AddedBy: "facebook" }, (err, accReg) => {
                            
                        });

                        user.insertUser({ Username: obj.email, FirstName: obj.first_name, LastName: obj.last_name, Photo: photo }, (err, addUser) => {
                            
                            res.setHeader('Content-Type', 'application/json');
                            res.status(200).send({ profilepic:photo, auth: true, username: req.body.username, orn: 'fb' });
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
            let responseString = '';
            resG.on('data', (chunk) => {
                responseString += chunk;
                let obj = JSON.parse(responseString);
                account.getAllAccountByCriteria({ Username: obj.email }, (err, acc) => {
                    if (acc[0]) //exist user
                    {
                        req.session.token = req.body.token;
                        req.session.id = req.body.id;
                        req.session.prv = "g";
                        req.session.email = obj.email;
                        account.lastLogin(obj.email, (err, updateLogin) => {
                            res.setHeader('Content-Type', 'application/json');
                            res.status(200).send({ profilepic:obj.picture, auth: true, username: obj.email, orn: 'g' });
                        })
                    } else {
                        req.session.token = req.body.token;
                        req.session.id = req.body.id;
                        req.session.prv = "g";
                        req.session.email = obj.email;
                        account.register({ Username: obj.email, Password: "fromgoogle", AddedBy: "google" }, (err, accReg) => {
                            
                        });

                        user.insertUser({ Username: obj.email, FirstName: obj.given_name, LastName: obj.family_name, Photo: obj.picture }, (err, addUser) => {
                            res.setHeader('Content-Type', 'application/json');
                            res.status(200).send({ profilepic:obj.picture, auth: true, username: obj.email, orn: 'g' });
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