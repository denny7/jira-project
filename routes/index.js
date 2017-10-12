var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var db = req.db
    var col = db.get('users');
    col.find({}).then(function(docs) {
        console.log(docs)
        res.render('index', { user: docs })
    })
});

module.exports = router;