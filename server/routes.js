var express = require('express');
var router = express.Router();
var db = require('./commentsdb');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/** Get 100 comments sorted by score. Can specify a range in the query. */
router.get('/comments', function (req, res) {
  var start = req && req.query && req.query.start;
  var end = req && req.query && req.query.end;
  var prom;
  if (start && end) {
    prom = db.searchAsync('ss_design', 'ss_created', {
      limit: 100,
      q: 'created:[' + start + ' TO ' + end + ']',
      sort: '"-score<number>"'
    });
  } else {
    prom = db.viewAsync('ss_design', 'ss_score', {descending: true, limit: 100});
  }
  prom.then(function (args) {
    res.json(args[0]);
  }).catch(function (e) {
    res.status(502);
    res.json(err);
  });
});

module.exports = router;
