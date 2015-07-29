/** Module dependencies. */
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var routes = require('./routes');
var db = require('./commentsdb');
var commentScraper = require('./commentscraper');
var personalityInsighter = require('./personalityinsighter');

// configure the express server
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, '../public')));
app.use('/', routes);

/** Start her up, boys */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

function loadCommentsForever (flag) {
  console.log('*********************************************');
  console.log('*********************************************');
  console.log('************* starting a thing! *************');
  console.log('*********************************************');
  console.log('*********************************************');
  if (flag) {
    return commentScraper.getAndUploadComments().finally(loadCommentsForever.bind(this, !flag));
  } else {
    return commentScraper.getAndUploadPostComments().finally(loadCommentsForever.bind(this, !flag));
  }
}
loadCommentsForever(true);
// personalityInsighter.getAggregatedTextRunInsightsAndUpload();
