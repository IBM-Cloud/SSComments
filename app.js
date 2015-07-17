/** Module dependencies. */
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var fs = require('fs');
var rawjs = require('raw.js');
var Promise = require('bluebird');
/** Referenced variables */
var app = express();
var reddit = Promise.promisifyAll(new rawjs("SubredditSimulatorCommentAggregator"));
var db;
var cloudant;
var fileToUpload;

// couldn't figure out how to make JSON environment variables locally so i
// set it to a stringified JSON object of the deployed environment variables
var cloudantNoSQLDB;
if (typeof process.env.VCAP_SERVICES === 'string') {
  cloudantNoSQLDB = JSON.parse(process.env.VCAP_SERVICES).cloudantNoSQLDB;
} else {
  cloudantNoSQLDB = process.env.VCAP_SERVICES.cloudantNoSQLDB;
}
var credentials = cloudantNoSQLDB[0].credentials;
var dbCredentials = {
  dbName: 'ss_comments_db',
  host: credentials.host,
  port: credentials.port,
  password: credentials.password,
  url: credentials.url,
  user: credentials.username
};

app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

function initDBConnection () {
  console.log('creating db connection...');
  cloudant = require('cloudant')(dbCredentials.url);
  db = Promise.promisifyAll(cloudant.use(dbCredentials.dbName));
}

/**
 * Get comments from /comments and put them cloudant
 * @param {String} after - optional, an id to start "after" - for pagination
 */
var count;
function addCommentsToCloudant (after) {
  console.log('getting more comments...');
  // first we get some comments from reddit
  var redditargs = {r: 'SubredditSimulator', limit: 100};
  if (after) {
    redditargs['after'] = 't1_' + after;
    redditargs['count'] = count;
    console.log('count: ' + count);
    console.log('after: ' + after);
  } else {
    count = 0;
  }

  var rawComments;
  return reddit.commentsAsync(redditargs).then(function (res) {
    rawComments = res.data.children;
    count += rawComments.length;
    return uploadComments(rawComments);
  }).then(function (args) {
    var body = args[0];
    var headers = args[1];
    // get the next page of comments
    if (rawComments.length) {
      var nextIdToGet = rawComments[rawComments.length - 1].data._id;
    }
    // wait 3s before getting the next page
    // setTimeout(function () { addCommentsToCloudant(nextIdToGet); }.bind(this), 2000);
    if (!nextIdToGet) {
      console.log('starting back at page one...');
      console.log('');
    }
  }).catch(function (e) {
    console.log(e);
  });
}

/**
 * Given an array of raw comment data from the reddit api, upload it to cloudant
 * First check to see if that comment id is already in the database, if it is, update
 * it with the most recent data
 * @param {Array.<CommentJson>}
 */
function uploadComments (comments) {
  var ids = comments.map(function (child) { return child.data.id });
  return db.viewAsync('ss_design', 'ss_ids', {keys: ids}).then(function (args) {
    var body = args[0];
    var headers = args[1];
    // build a map of comment ids to _revs
    var idToRevMap = {};
    var rows = body.rows;
    if (rows.length) {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        idToRevMap[row.id] = row.value._rev;
      }
    }
    // now we build an array of comments from the raw reddit data
    var docs = [];
    for (var i = 0; i < comments.length; i++) {
      var comment = comments[i].data;
      // if this comment is already in cloudant, tack on the _rev
      if (idToRevMap[comment.id]) {
        comment['_rev'] = idToRevMap[comment.id];
      }
      // we like to call these puppies _ids, not ids
      comment['_id'] = comment.id;
      delete comment.id;
      // add it to our array
      docs.push(comment);
    }
    // perform the bulk operation - this'll do updates for things that are already there
    // and insert the comments that we don't yet know about
    return db.bulkAsync({docs: docs}, {});
  })
}

/** Routes time */
app.get('/', function (req, res) {
  res.render('index');
});

/** Get 20 comments sorted by score */
app.get('/comments', function (req, res) {
  db.view('ss_design', 'ss_score', {descending: true, limit: 100}, function (err, body, headers) {
    if (err) {
      res.status(502);
      res.json(err);
    } else {
      res.json(body);
    }
  });
});

/** Start her up, boys */
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
initDBConnection();
addCommentsToCloudant();
