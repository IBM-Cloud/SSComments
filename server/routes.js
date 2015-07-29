var express = require('express');
var router = express.Router();
var db = require('./db');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/** Get 100 comments sorted by score. Can specify a range in the query. */
router.get('/comments', function (req, res) {
  var start = req && req.query && req.query.start;
  var end = req && req.query && req.query.end;
  if (start && end) {
    db.search('ss_design', 'ss_created', {
      limit: 100,
      q: 'created:[' + start + ' TO ' + end + ']',
      sort: '"-score<number>"'
    }, function (err, body, headers) {
      if (err) {
        res.status(502);
        res.json(err);
      } else {
        res.json(body);
      }
    });
  } else {
    db.view('ss_design', 'ss_score', {descending: true, limit: 100}, function (err, body, headers) {
      if (err) {
        res.status(502);
        res.json(err);
      } else {
        res.json(body);
      }
    });
  }
});

module.exports = router;
