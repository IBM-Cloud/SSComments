var request = require('superagent');

var requester = {
  /**
   * Load the first 'page' of comments.
   * @param {String} range - optional, can be one of 'today', 'yesterday', 'thisweek',
   *                         'lastweek', or 'thismonth'
   * @return a bluebird promise that resolves with an array of comments
   */
  loadComments: function (range) {
    return new Promise(function (resolve, reject) {
      var queryObj = {};
      if (range) {
        queryObj.range = range;
      }
      request.get('/comments').query(queryObj).end(function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res.body.rows);
        }
      })
    });
  }
}

module.exports = requester;