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
    console.log(req.body);
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

router.post('/media/upload', function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    let article = req.files.article;
    const uuidv1 = require('uuid/v1');
    let ftype = article.mimetype.split('/')[1];
    article.name = uuidv1() + "." + ftype;

    let storage = config.picture;

    article.mv(storage + article.name, function (err) {
        if (err)
            return res.status(500).send(err);
        res.status(200).send({ "filename": article.name });
    });
});

router.post('/category', function (req, res, next) {
    art.insertArticleCategory(req.body, function (err, resultInsert) {
        if (err) { res.json(err); }
        else { res.json(resultInsert); }
    });
});

router.delete('/category/:key1/:key2', function (req, res, next) {
    art.deleteArticleCategory(req.params.key1,req.params.key2, function (err, resultInsert) {
        if (err) { res.json(err); }
        else { res.json(resultInsert); }
    });
});

module.exports = router;