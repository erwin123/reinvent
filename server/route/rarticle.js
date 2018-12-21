var art = require('../model/article');
var writer = require('../model/user');
const config = require('../config');
var express = require('express');
var router = express.Router();
var async = require('async');

router.get('/', function (req, res, next) {
    art.getAllArticle(function (err, rows) {
        if (err) { res.json(err); }
        else {
            res.json(rows);
        }
    });
});

router.get('/search/:key', function (req, res, next) {
    if (req.params.key) {
        art.globalSearch(req.params.key, function (err, rows) {
            if (err) { res.json(err); }
            else {
                
                rows.forEach((el, idx) => {
                    console.log(idx);
                    async.parallel([
                        (callback) => {
                            art.getAllMediaArticle({ ArticleCode: el.ArticleCode }, (e1, r1) => {
                                el.Medias = r1;
                                callback(e1, r1);
                            });
                        },
                        (callback) => {
                            writer.getAllUserByCriteria({ UserCode: el.CreatedBy }, (e2, r2) => {
                                el.Writer = r2[0];
                                callback(e2, r2);
                            });
                        },
                        (callback) => {
                            art.getAllLikeArticle({ ArticleCode: el.ArticleCode }, (e3, r3) => {
                                if (r3.length > 0) {
                                    el.Likes = r3;
                                }
                                callback(e3, r3);
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
            if (rows.length === 0) {
                res.json(rows);
            }
        });
    } else {
        res.json('');
    }
});

router.post('/cr/', function (req, res, next) {
    if (req.body) {
        art.getAllArticleByCriteria(req.body, function (err, rows) {
            if (err) { res.json(err); }
            else {
                rows.forEach((el, idx) => {
                    async.parallel([
                        (callback) => {
                            art.getAllMediaArticle({ ArticleCode: el.ArticleCode }, (e1, r1) => {
                                el.Medias = r1;
                                callback(e1, r1);
                            });
                        },
                        (callback) => {
                            writer.getAllUserByCriteria({ UserCode: el.CreatedBy }, (e2, r2) => {
                                el.Writer = r2[0];
                                callback(e2, r2);
                            });
                        },
                        (callback) => {
                            art.getAllLikeArticle({ ArticleCode: el.ArticleCode }, (e3, r3) => {
                                if (r3.length > 0) {
                                    el.Likes = r3;
                                }
                                callback(e3, r3);
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
            if (rows.length === 0) {
                res.json(rows);
            }
        });
    }
});

router.get('/last/', function (req, res, next) {
    if (req.body) {
        art.getAllArticleLastMonth(function (err, rows) {
            if (err) { res.json(err); }
            else {
                rows.forEach((el, idx) => {
                    async.parallel([
                        (callback) => {
                            art.getAllMediaArticle({ ArticleCode: el.ArticleCode }, (e1, r1) => {
                                el.Medias = r1;
                                callback(e1, r1);
                            });
                        },
                        (callback) => {
                            writer.getAllUserByCriteria({ UserCode: el.CreatedBy }, (e2, r2) => {
                                el.Writer = r2[0];
                                callback(e2, r2);
                            });
                        },
                        (callback) => {
                            art.getAllLikeArticle({ ArticleCode: el.ArticleCode }, (e3, r3) => {
                                if (r3.length > 0) {
                                    el.Likes = r3;
                                }
                                callback(e3, r3);
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
            if (rows.length === 0) {
                res.json(rows);
            }
        });
    }
});

router.post('/feed/:limit/:lastid/:direction', function (req, res, next) {
    if (req.body) {
        art.getAllArticleFeed(req.body, req.params.limit, req.params.lastid, req.params.direction, function (err, rows) {
            if (err) { res.json(err); }
            else {
                rows.forEach((el, idx) => {
                    async.parallel([
                        (callback) => {
                            art.getAllMediaArticle({ ArticleCode: el.ArticleCode }, (e1, r1) => {
                                el.Medias = r1;
                                callback(e1, r1);
                            });
                        },
                        (callback) => {
                            writer.getAllUserByCriteria({ UserCode: el.CreatedBy }, (e2, r2) => {
                                el.Writer = r2[0];
                                callback(e2, r2);
                            });
                        },
                        (callback) => {
                            art.getAllLikeArticle({ ArticleCode: el.ArticleCode }, (e3, r3) => {
                                if (r3.length > 0) {
                                    el.Likes = r3;
                                }
                                callback(e3, r3);
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
            if (rows.length === 0) {
                res.json(rows);
            }
        });
    }
});

router.post('/like', function (req, res, next) {
    art.insertArticleLikes(req.body, function (err, resultInsert) {
        if (err) { res.json(err); }
        else { res.json(resultInsert); }
    });
});

router.post('/', function (req, res, next) {
    art.insertArticle(req.body, function (err, resultInsert) {
        if (err) { res.json(err); }
        else { res.json(resultInsert); }
    });
});

router.put('/', function (req, res, next) {
    art.updateArticle(req.body, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.delete('/like/:key', function (req, res, next) {
    art.deleteArticle(req.params.key, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.delete('/like/:key1/:key2', function (req, res, next) {
    art.deleteArticleLikes(req.params.key1, req.params.key2, function (err, rows) {
        if (err) { res.json(err); }
        else { res.json(rows); }
    });
});

router.post('/fave/cr/', function (req, res, next) {
    if (req.body) {
        art.getAllArticleFeedByCriteria(req.body, function (err, rows) {
            if (err) { res.json(err); }
            else {
                rows.forEach((el, idx) => {
                    async.parallel([
                        (callback) => {
                            art.getAllMediaArticle({ ArticleCode: el.ArticleCode }, (e1, r1) => {
                                el.Medias = r1;
                                callback(e1, r1);
                            });
                        },
                        (callback) => {
                            writer.getAllUserByCriteria({ UserCode: el.CreatedBy }, (e2, r2) => {
                                el.Writer = r2[0];
                                callback(e2, r2);
                            });
                        },
                        (callback) => {
                            art.getAllLikeArticle({ ArticleCode: el.ArticleCode }, (e3, r3) => {
                                if (r3.length > 0) {
                                    el.Likes = r3;
                                }
                                callback(e3, r3);
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
                if (rows.length === 0) {
                    res.json(rows);
                }
            }
            
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

router.post('/media/data', function (req, res, next) {
    art.insertMediaArticle(req.body, function (err, resultInsert) {
        if (err) { res.json(err); }
        else { res.json(resultInsert); }
    });
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
    art.deleteArticleCategory(req.params.key1, req.params.key2, function (err, resultInsert) {
        if (err) { res.json(err); }
        else { res.json(resultInsert); }
    });
});

module.exports = router;