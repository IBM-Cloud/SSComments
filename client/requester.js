import request from 'superagent';

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

var requester = {
  /**
   * Load the first 'page' of comments.
   * @param {String} range - optional, can be one of 'today', 'yesterday', 'thisweek',
   *                         'lastweek', or 'thismonth'
   * @return a promise that resolves with an array of comments
   */
  loadComments: function (range) {
    var start, end;
    if (range === 'today') {
      start = toUNIXDate(getToday());
      end = toUNIXDate(getTomorrow());
    } else if (range === 'yesterday') {
      start = toUNIXDate(getYesterday());
      end = toUNIXDate(getToday());
    } else if (range === 'thisweek') {
      start = toUNIXDate(getStartOfWeek());
      end = toUNIXDate(getTomorrow());
    } else if (range === 'lastweek') {
      start = toUNIXDate(getStartOfLastWeek());
      end = toUNIXDate(getEndOfLastWeek());
    } else if (range === 'thismonth') {
      start = toUNIXDate(getStartOfMonth());
      end = toUNIXDate(getTomorrow());
    }
    return new Promise(function (resolve, reject) {
      var queryObj = {};
      if (range) {
        queryObj.start = start;
        queryObj.end = end;
      }
      request.get('/comments').query(queryObj).end(function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res.body.rows);
        }
      })
    });
  },

  /**
   * Load an array of bots that have available insights
   * @return a promise that resolves with said array
   */
  fetchBotsWithInsights: function () {
    return new Promise(function (resolve, reject) {
      request.get('/availableinsights').end(function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res.body);
        }
      });
    });
  },

  /**
   * Load the insights for a given bot
   */
  fetchInsights: function (bot) {
    return new Promise(function (resolve, reject) {
      request.get('/insights').query({bot: bot}).end(function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res.body);
        }
      });
    });
  },

  /**
   * Load the top 5 bots for each category
   */
  fetchAllInsights: function () {
    return new Promise(function (resolve, reject) {
      request.get('/allinsights').end(function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res.body);
        }
      });
    })
  },

  /**
   * Given a category, sort the top 100 bots by their percentile
   */
  fetchBotsByCategory: function (category) {
    return new Promise(function (resolve, reject) {
      request.get('/insightssort').query({category: category}).end(function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res.body);
        }
      });
    });
  }
}

module.exports = requester;