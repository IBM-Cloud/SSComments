/** Module dependencies. */
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var fs = require('fs');
var rawjs = require('raw.js');
/** Referenced variables */
var app = express();
var reddit = new rawjs("SubredditSimulatorCommentAggregator");
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
  db = cloudant.use(dbCredentials.dbName);
}
initDBConnection();

/**
 * Put some stuff in cloudant
 * @param {String} after - optional, an id to start "after" - for pagination
 */
function addCommentsToCloudant (after) {
  console.log('getting more comments...');
  // first we get some comments from reddit
  var redditargs = {r: 'SubredditSimulator'};
  if (after) {
    redditargs['after'] = 't1_' + after;
  }
  reddit.comments(redditargs, function (err, res) {
    if (err) {
      console.error(err);
    } else {
      // then we build an array of ids to see if we already know about these comments
      var ids = res.data.children.map(function (child) { return child.data.id });
      var data = res.data;
      db.view('ss_design', 'ss_ids', {keys: ids}, function (err, body, headers) {
        if (err) {
          console.error(err);
        } else {
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
          for (var i = 0; i < data.children.length; i++) {
            var comment = data.children[i].data;
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
          db.bulk({docs: docs}, {}, function (err, body, headers) {
            if (err) {
              console.error(err);
            } else {
              // get the next page of comments
              var nextIdToGet = docs.length && docs[docs.length - 1]._id;
              if (nextIdToGet) {
                // wait 3s before getting the next page
                setTimeout(function () { addCommentsToCloudant(nextIdToGet); }.bind(this), 3000);
              }
            }
          });
        }
      });
    }
  });
}
addCommentsToCloudant();

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
