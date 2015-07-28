var express = require('express');
var router = express.Router();
var db = require('./db');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/** Get 100 comments sorted by score. Can specify a range in the query. */
router.get('/comments', function (req, res) {
  var range = req && req.query && req.query.range;
  if (range) {
    var q;
    if (range === 'today') {
      q = 'created:[' + toUNIXDate(getToday()) + ' TO ' + toUNIXDate(getTomorrow()) + ']';
    } else if (range === 'yesterday') {
      q = 'created:[' + toUNIXDate(getYesterday()) + ' TO ' + toUNIXDate(getToday()) + ']';
    } else if (range === 'thisweek') {
      q = 'created:[' + toUNIXDate(getStartOfWeek()) + ' TO ' + toUNIXDate(getTomorrow()) + ']';
    } else if (range === 'lastweek') {
      q = 'created:[' + toUNIXDate(getStartOfLastWeek()) + ' TO ' + toUNIXDate(getEndOfLastWeek()) + ']';
    } else if (range === 'thismonth') {
      q = 'created:[' + toUNIXDate(getStartOfMonth()) + ' TO ' + toUNIXDate(getTomorrow()) + ']';
    }
    db.search('ss_design', 'ss_created', {
      limit: 100,
      q: q,
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

/* Helper methods for date string formatting */
function getToday () {
  return new Date((new Date()).toDateString());
}
function getTomorrow () {
  var today = getToday();
  return new Date(today.getUTCFullYear(), today.getMonth(), today.getDate() + 1);
}
function getYesterday () {
  var today = getToday();
  return new Date(today.getUTCFullYear(), today.getMonth(), today.getDate() - 1);
}
function getStartOfWeek () {
  var today = getToday();
  return new Date(today.getUTCFullYear(), today.getMonth(), today.getDate() - today.getDay());
}
function getStartOfLastWeek () {
  var startOfWeek = getStartOfWeek();
  return new Date(startOfWeek.getUTCFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() - 7);
}
function getEndOfLastWeek () {
  var startOfLastWeek = getStartOfLastWeek();
  return new Date(startOfLastWeek.getUTCFullYear(), startOfLastWeek.getMonth(), startOfLastWeek.getDate() + 6);
}
function getStartOfMonth () {
  var today = getToday();
  return new Date(today.getUTCFullYear(), today.getMonth(), 1);
}
function toUNIXDate (date) {
  return Math.floor(date.getTime() / 1000);
}

module.exports = router;
