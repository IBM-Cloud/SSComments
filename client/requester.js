var request = require('superagent');

var requester = {
  /**
   * Load the first 'page' of comments.
   * @return a bluebird promise that resolves with an array of comments
   */
  loadInitialComments: function () {
    return new Promise(function (resolve, reject) {
      request.get('/comments').end(function (err, res) {
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