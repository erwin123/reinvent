var user = require('../model/user');
const config = require('../config');
var express = require('express');
var router = express.Router();

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

module.exports = router;