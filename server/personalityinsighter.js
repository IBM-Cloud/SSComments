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

var watson = require('watson-developer-cloud');
var Promise = require('bluebird');
var commentsDB = require('./commentsdb');
var insightsDB = require('./insightsdb');

// couldn't figure out how to make JSON environment variables locally so i
// set it to a stringified JSON object of the deployed environment variables
var personality_insights;
if (typeof process.env.VCAP_SERVICES === 'string') {
  personality_insights = JSON.parse(process.env.VCAP_SERVICES).personality_insights;
} else {
  personality_insights = process.env.VCAP_SERVICES.personality_insights;
}

var credentials = {
  version: 'v2',
  username: personality_insights[0].credentials.username,
  password: personality_insights[0].credentials.password
}

var personalityInsights = watson.personality_insights(credentials);

module.exports = {
  /**
   * Run map reduce on the aggregate_text cloudant view to get aggregated text for each author/bot
   * Then with the output of that `aggregatedTextObj` (for each author), run watson personality insights
   * and upload that to the insights database
   */
  getAggregatedTextRunInsightsAndUpload: function () {
    var authors;
    // TODO we'll have to change this if there ever are more than 1000
    return commentsDB.viewAsync('ss_design', 'aggregate_text', {reduce: true, group: true, limit: 1000}).then(function (args) {
      var body = args[0];
      authors = body.rows;
      // filter out the bots with less than 2000 words (watson works best when it has more than 2000)
      authors = authors.filter(function (r) {return r.value.body.split(' ').length > 1200 });
      // now we wanna filter out the insights that we already have data for
      // ...so we gotta find out which ones those are!
      var authorKeys = authors.map(function (row) { return row.key });
      return insightsDB.viewAsync('insights_design', 'insights_id_to_rev', {keys: authorKeys});
    }).then(function (args) {
      var body = args[0];
      // build a map if ids to rev numbers for things already present
      var idToRevMap = {};
      var rows = body.rows;
      if (rows.length) {
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          idToRevMap[row.id] = row.value;
        }
      }
      return this.doItForALotOfThings(authors, idToRevMap);
    }.bind(this)).catch(function (e) {
      console.error(e);
    });
  },

  /**
   * Given an `aggregatedTextObj`, run the personality insights and upload it to our insights database
   */
  getInsightsAndUpload: function (aggregatedTextObj, revNum) {
    // for whatever reason promisify didnt work on personalityInsights
    return new Promise(function (resolve, reject) {
      personalityInsights.profile({text: aggregatedTextObj.value.body}, function (err, profile) {
        if (!err) {
          console.log('successfully got insights for ' + aggregatedTextObj.key);
          delete profile.id;
          delete profile.processed_lang;
          delete profile.source;
          profile._id = aggregatedTextObj.key;
          if (revNum) {
            profile._rev = revNum;
          }
          insightsDB.insertAsync(profile, {}).then(function () {
            console.log('successfully uploaded insights');
            resolve();
          });
        } else {
          reject(err);
        }
      });
    });
  },

  /**
   * Given an array of `aggregatedTextObj`s, run insights and upload 'em
   */
  doItForALotOfThings: function (aggregatedTextObjs, idToRevMap) {
    return new Promise(function (resolve, reject) {
      this._doItForALotOfThingsHelper(aggregatedTextObjs, idToRevMap, resolve, reject);
    }.bind(this));
  },

  /**
   * Helper method for Promise recursion
   */
  _doItForALotOfThingsHelper: function (aggregatedTextObjs, idToRevMap, resolve, reject) {
    console.log('getting insights for ' + aggregatedTextObjs.length + ' more bots');
    if (aggregatedTextObjs.length) {
      var currAuthor = aggregatedTextObjs.shift();
      this.getInsightsAndUpload(currAuthor, idToRevMap[currAuthor.key]).then(function () {
        this._doItForALotOfThingsHelper(aggregatedTextObjs, idToRevMap, resolve, reject);
      }.bind(this)).catch(function (e) {
        reject(e);
      });
    } else {
      resolve();
    }
  }
}