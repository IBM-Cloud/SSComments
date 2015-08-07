//------------------------------------------------------------------------------
// Copyright IBM Corp. 2015
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------

var express = require('express');
var router = express.Router();
var path = require('path');
var commentsDB = require('./commentsdb');
var insightsDB = require('./insightsdb');
var CategoryMap = require('./CategoryToDescriptionMap.json');
var Promise = require('bluebird');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index');
});

/* Get terms of service */
router.get('/tos', function (req, res) {
  res.sendfile(path.resolve(__dirname, '../public/tos.html'));
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
  var insightCategory = req && req.query && req.query.category.replace(' ', '_').replace('-', '_');
  loadCategory(insightCategory, 50).then(function (args) {
    var response = args[0];
    var insightCategory = req.query.category.replace(' ', '_').replace('-', '_');
    response.description = CategoryMap[insightCategory];
    res.json(response);
  }).catch(function (e) {
    res.status(502);
    res.json(e);
  });
});

// we're not updating the insights regularly, so we're gonna cheat a lil bit.
// the first time we calculate the response... we're just gonna cache it! The round
// trip 50+ cloudant queries takes ~1.5s. This way we only have to do it once. NOTE:
// when we update the insights, we'll need to clear this
var cheatCache;
/** Get the top 5 for each category */
router.get('/allinsights', function (req, res) {
  if (cheatCache) {
    res.json(cheatCache);
  } else {
    var categories = Object.keys(CategoryMap);
    var categoryPromises = categories.map(function (c) { return loadCategory(c, 5); });
    Promise.all(categoryPromises).then(function (args) {
      var insights = args.map(function (insight, i) {
        var category = categories[i];
        insight = insight[0];
        insight.category = category;
        insight.description = CategoryMap[category];
        delete insight.bookmark;
        delete insight.total_rows;
        return insight;
      });
      cheatCache = insights;
      res.json(insights);
    }).catch(function (e) {
      res.status(502);
      res.json(e);
    });
  }
});

function loadCategory (category, limit) {
  return insightsDB.searchAsync('insights_design', 'sortable', {
    limit: limit,
    q: '*:*',
    sort: '"-' + category + '<number>"'
  })
}

module.exports = router;
