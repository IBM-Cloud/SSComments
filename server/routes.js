var express = require('express');
var router = express.Router();
var commentsDB = require('./commentsdb');
var insightsDB = require('./insightsdb');

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
    prom = commentsDB.searchAsync('ss_design', 'ss_created', {
      limit: 100,
      q: 'created:[' + start + ' TO ' + end + ']',
      sort: '"-score<number>"'
    });
  } else {
    prom = commentsDB.viewAsync('ss_design', 'ss_score', {descending: true, limit: 100});
  }
  prom.then(function (args) {
    res.json(args[0]);
  }).catch(function (e) {
    res.status(502);
    res.json(e);
  });
});

/** Get a list of the authors/bots that we have insights for */
router.get('/availableinsights', function (req, res) {
  insightsDB.viewAsync('insights_design', 'insights_id_to_rev', {}).then(function (args) {
    var rows = args[0].rows;
    res.json(rows.map(function (r) { return r.key; }));
  }).catch(function (e) {
    res.status(502);
    res.json(e);
  });
});

/** Get insights for a specific bot */
router.get('/insights', function (req, res) {
  var bot = req && req.query && req.query.bot;
  if (!bot) {
    res.status(400);
    res.json(new Error('Must specify a bot'));
  } else {
    insightsDB.getAsync(bot, {}).then(function (args) {
      res.json(args[0]);
    }).catch(function (e) {
      res.status(e.statusCode);
      res.json(e);
    })
  }
});

/** Get insights for a specific bot */
router.get('/insightssort', function (req, res) {
  var insightCategory = req && req.query && req.query.category.replace(' ', '_');
  insightsDB.searchAsync('insights_design', 'sortable', {
    limit: 100,
    q: '*:*',
    sort: '"-' + insightCategory + '<number>"'
  }).then(function (args) {
    res.json(args[0]);
  }).catch(function (e) {
    res.status(502);
    res.json(e);
  });
});

module.exports = router;
