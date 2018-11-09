var cat = require('../model/category');
const config = require('../config');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    cat.getAllCategory(function (err, rows) {
        if (err) { res.json(err); }
        else {
            res.json(rows);
        }
    });
});

router.post('/cr/', function (req, res, next) {
    if (req.body) {
        cat.getAllCategoryByCriteria(req.body, function (err, rows) {
            if (err) { res.json(err); }
            else { res.json(rows); }
        });
    }
});

router.post('/', function (req, res, next) {
    cat.insertCategory(req.body, function (err, resultInsert) {
        if (err) { res.json(err); }
        else { res.json(resultInsert); }
    });
});

router.delete('/:key', function (req, res, next) {
    cat.deleteCategory(req.params.key, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});



//user category -------------------------------------------------
router.get('/usr/', function (req, res, next) {
    cat.getAllUserCategory(function (err, rows) {
        if (err) { res.json(err); }
        else {
            res.json(rows);
        }
    });
});

router.post('/usr/cr/', function (req, res, next) {
    if (req.body) {
        cat.getAllUserCategoryByCriteria(req.body, function (err, rows) {
            if (err) { res.json(err); }
            else { res.json(rows); }
        });
    }
});

router.post('/usr/', function (req, res, next) {
    cat.insertUserCategory(req.body, function (err, resultInsert) {
        if (err) { res.json(err); }
        else { res.json(resultInsert); }
    });
});

router.delete('/usr/:key1/:key2', function (req, res, next) {
    cat.deleteUserCategory(req.params.key1, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

module.exports = router;