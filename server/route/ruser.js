var user = require('../model/user');
const config = require('../config');
var express = require('express');
var router = express.Router();
var async = require('async');

router.get('/whoami', function (req, res, next) {
    user.getAllUserByCriteria({ Username: req.session.email }, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.get('/', function (req, res, next) {
    user.getAllUser(function (err, rows) {
        if (err) { res.json(err); }
        else {
            res.json(rows);
        }
    });
});

router.post('/cr/', function (req, res, next) {
    if (req.body) {
        user.getAllUserByCriteria(req.body, function (err, rows) {
            if (err) { res.json(err); }
            else { res.json(rows); }
        });
    }
});

router.post('/', function (req, res, next) {
    user.insertUser(req.body, function (err, resultInsert) {
        if (err) { res.json(err); }
        else { res.json(resultInsert); }
    });
});

router.put('/', function (req, res, next) {
    user.updateUser(req.body, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.delete('/:key', function (req, res, next) {
    user.deleteUser(req.params.key, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});


//follow
router.post('/follow/cr/', function (req, res, next) {
    if (req.body) {
        user.getAllFollowByCriteria(req.body, function (err, rows) {
            if (err) { res.json(err); }
            else {
                if (req.body.FollowerCode) //get Following people
                {
                    if(rows.length == 0){
                        res.json(rows);
                    }
                    rows.forEach((el, idx) => {
                        async.parallel([
                            (callback) => {
                                user.getAllUserByCriteria({ UserCode: el.UserCode }, (e1, r1) => {
                                    el.Follower = r1[0];
                                    callback(e1, r1);
                                });
                            }
                        ], (err, results) => {
                            if (rows.length - 1 === idx) {
                                setTimeout(() => {
                                    res.json(rows);
                                }, 1000);
                            }
                        });
                    });
                } else {//get follower people
                    rows.forEach((el, idx) => {
                        async.parallel([
                            (callback) => {
                                user.getAllUserByCriteria({ UserCode: el.FollowerCode }, (e2, r2) => {
                                    el.Follower = r2[0];
                                    callback(e2, r2);
                                });
                            }
                        ], (err, results) => {
                            if (rows.length - 1 === idx) {
                                setTimeout(() => {
                                    res.json(rows);
                                }, 1000);
                                
                            }
                        });
                    });
                }
            }
        });
    }
});

router.post('/follow/', function (req, res, next) {
    user.insertFollow(req.body, function (err, resultInsert) {
        if (err) { res.json(err); }
        else { res.json(resultInsert); }
    });
});

router.delete('/follow/:key1/:key2', function (req, res, next) {
    user.deleteFollow(req.params.key1, req.params.key2, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});


module.exports = router;