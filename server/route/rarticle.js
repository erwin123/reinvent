var art = require('../model/article');
const config = require('../config');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    art.getAllArticle(function (err, rows) {
        if (err) { res.json(err); }
        else {
            res.json(rows);
        }
    });
});

router.post('/cr/', function (req, res, next) {
    if (req.body) {
        art.getAllArticleByCriteria(req.body, function (err, rows) {
            if (err) { res.json(err); }
            else { res.json(rows); }
        });
    }
});

router.post('/', function (req, res, next) {
    art.insertArticle(req.body, function (err, resultInsert) {
        if (err) { res.json(err); }
        else { res.json(resultInsert); }
    });
});

router.delete('/:key', function (req, res, next) {
    art.deleteArticle(req.params.key, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.post('/fave/cr/', function (req, res, next) {
    if (req.body) {
        art.getAllArticleFeedByCriteria(req.body, function (err, rows) {
            if (err) { res.json(err); }
            else { res.json(rows); }
        });
    }
});

router.post('/media/', function (req, res, next) {
    if (req.body) {
        art.getAllMediaArticle(req.body, function (err, rows) {
            if (err) { res.json(err); }
            else { res.json(rows); }
        });
    }
});

module.exports = router;