var express = require('express');
var router = express.Router();
var db = require('./db');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/** Get 20 comments sorted by score */
router.get('/comments', function (req, res) {
  db.view('ss_design', 'ss_score', {descending: true, limit: 100}, function (err, body, headers) {
    if (err) {
      res.status(502);
      res.json(err);
    } else {
      res.json(body);
    }
  });
});

module.exports = router;