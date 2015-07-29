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
    var rows;
    // TODO we'll have to change this if there ever are more than 1000
    return commentsDB.viewAsync('ss_design', 'aggregate_text', {reduce: true, group: true, limit: 1000}).then(function (args) {
      var body = args[0];
      rows = body.rows;
      // filter out the bots with less than 2000 words (watson works best when it has more than 2000)
      // and sort by their total aggregate score
      rows = rows.filter(function (r) {return r.value.body.split(' ').length > 2000 })
        .sort(function (r1, r2) {
          if (r1.value.score < r2.value.score) {
            return 1;
          } else if (r1.value.score > r2.value.score) {
            return -1;
          } else {
            return 0;
          }
        });
      // now we wanna filter out the insights that we already have data for
      // ...so we gotta find out which ones those are!
      var authors = rows.map(function (row) { return row.key });
      return insightsDB.viewAsync('insights_design', 'insights_id_to_rev', {keys: authors});
    }).then(function (args) {
      var body = args[0];
      // build an array of the authors already present in our insights database
      // and filter them out of the rows that we want to make requests for
      // TODO: if we're feeling adventerous at a later point and want to update the insights, we'll
      // have to fetch the revision numbers and update that way
      var presentAuthors = body.rows.map(function (row) { return row.id });
      rows = rows.filter(function (r) { return presentAuthors.indexOf(r.key) === -1; });
      return this.doItForALotOfThings(rows);
    }.bind(this)).catch(function (e) {
      console.error(e);
    });
  },

  /**
   * Given an `aggregatedTextObj`, run the personality insights and upload it to our insights database
   */
  getInsightsAndUpload: function (aggregatedTextObj) {
    // for whatever reason promisify didnt work on personalityInsights
    return new Promise(function (resolve, reject) {
      personalityInsights.profile({text: aggregatedTextObj.value.body}, function (err, profile) {
        if (!err) {
          console.log('successfully got insights for ' + aggregatedTextObj.key);
          delete profile.id;
          delete profile.processed_lang;
          delete profile.source;
          profile._id = aggregatedTextObj.key;
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
  doItForALotOfThings: function (aggregatedTextObjs) {
    return new Promise(function (resolve, reject) {
      this._doItForALotOfThingsHelper(aggregatedTextObjs, resolve, reject);
    }.bind(this));
  },

  /**
   * Helper method for Promise recursion
   */
  _doItForALotOfThingsHelper: function (aggregatedTextObjs, resolve, reject) {
    console.log('getting insights for ' + aggregatedTextObjs.length + ' more bots');
    if (aggregatedTextObjs.length) {
      var currAuthor = aggregatedTextObjs.shift();
      this.getInsightsAndUpload(currAuthor).then(function () {
        this._doItForALotOfThingsHelper(aggregatedTextObjs, resolve, reject);
      }.bind(this)).catch(function (e) {
        reject(e);
      });
    } else {
      resolve();
    }
  }
}