var db = require('./db');
var Promise = require('bluebird');
var rawjs = require('raw.js');
var reddit = Promise.promisifyAll(new rawjs("SubredditSimulatorCommentAggregator"));

module.exports = {
  LOAD_LIMIT: 100,        // the max that reddit supports
  MAX_POST_PAGE_COUNT: 3, // 300 posts = 12.5 days

  /**
   * For a given link (undefined if you wanna just load all new comments), keep loading
   * the next page and uploading the results to cloudant.
   * @return {Promise} resolves when done, rejects if it error'd out
   */
  getAndUploadComments: function (link) {
    return new Promise(function (resolve, reject) {
      this._getAndUploadHelper(null, link, null, resolve, reject);
    }.bind(this));
  },

  /**
   * Get comments from /comments and put them cloudant. Note: this is recursive.
   * @param {String} after - optional, a comment id to start "after" - for pagination
   * @param {String} link - optional, a link id to load new comments for
   * @param {number} count - optional, used for pagination, specify how many comments we've already loaded
   * @param {function} resolve - optional, a Promise's resolve function that we can resolve if we've retrieved the last comment
   * @param {function} reject - optional, a Promise's reject function we can reject
   */
  _getAndUploadHelper: function (after, link, count, resolve, reject) {
    var log;
    count = count || 0;
    // format the args for the commentsAsync api
    var redditargs = {r: 'SubredditSimulator', limit: this.LOAD_LIMIT};
    if (link) {
      redditargs.link = link;
      redditargs.sort = 'new';
      log = 'getting comments for post ' + link;
    } else {
      log = 'getting newest comments';
    }
    if (after) {
      redditargs.after = 't1_' + after;
      redditargs.count = count;
      log += ' after ' + after + ', total so far is ' + count;
    } else {
      count = 0;
    }
    console.log(log);

    var rawComments;
    return reddit.commentsAsync(redditargs).then(function (res) {
      rawComments = res.length ? res[0].data.children : res.data.children;
      count += rawComments.length;
      return this.uploadComments(rawComments);
    }.bind(this)).then(function (args) {
      var body = args[0];
      var headers = args[1];
      // get the next page of comments
      if (rawComments.length && rawComments.length >= this.LOAD_LIMIT) {
        var nextIdToGet = rawComments[rawComments.length - 1].data._id;
      }
      // wait 3s before getting the next page
      if (nextIdToGet) {
        setTimeout(this._getAndUploadHelper.bind(this, nextIdToGet, link, count, resolve, reject), 3000);
      } else {
        setTimeout(resolve.bind(this, count), 3000);
      }
    }.bind(this)).catch(function (e) {
      console.error(e);
      // gotta figure out why paging isnt working when specifying a link
      resolve && resolve(count);
    });
  },

  /**
   * Keep on loading posts until there are no more. For each post, load all of its comments
   * and upload them. Note: this recursively calls itself until it is done.
   * @param {String} after - optional, if we're paging, start the next fetch after this given id
   * @return {Promise} resolve when done
   */
  getAndUploadPostComments: function (after, pageCount) {
    console.log('getting comments from posts...');
    pageCount = pageCount || 0;
    var posts;
    var redditargs = {r: 'SubredditSimulator', limit: this.LOAD_LIMIT};
    if (after) {
      redditargs.after = 't3_' + after;
    }
    return reddit.newAsync(redditargs).then(function (args) {
      return (new Promise(function (resolve, reject) {
        return this._getAndUploadPostHelper(args.children, resolve, reject);
      }.bind(this))).then(function (lastid) {
        if (lastid && pageCount < this.MAX_POST_PAGE_COUNT) {
          return this.getAndUploadPostComments(lastid, pageCount++);
        } else {
          return;
        }
      }.bind(this));
    }.bind(this)).catch(function (e) {
      console.error(e);
    });
  },

  /**
   * Given an array of posts, load the comments for each post one by one and add them to
   * cloudant.
   * @param  {Array.<Reddit Post JSON>} posts - the array of posts
   * @param  {function} resolve - a Promise's resolve function
   * @param  {function} reject  [description]
   * @param  {String} lastid - passed down recursively so that we can resolve with the last ID
   * that we fetched comments for. Used for paging the posts
   */
  _getAndUploadPostHelper: function (posts, resolve, reject, lastid) {
    console.log('loading comments for ' + posts.length + ' more posts');
    if (posts.length) {
      var currPost = posts.shift();
      this.getAndUploadComments(currPost.data.id).then(function (count) {
        this._getAndUploadPostHelper(posts, resolve, reject, currPost.data.id);
      }.bind(this)).catch(function (e) {
        reject(e);
      });
    } else {
      resolve(lastid);
    }
  },

  /**
   * Given an array of raw comment data from the reddit api, upload it to cloudant
   * First check to see if that comment id is already in the database, if it is, update
   * it with the most recent data
   * @param {Array.<CommentJson>}
   */
  uploadComments: function (comments) {
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
        // delete the children - TODO: we should actually flatten these
        if (comment.children) {
          delete comment.children;
        }
        // add it to our array
        docs.push(comment);
      }
      // perform the bulk operation - this'll do updates for things that are already there
      // and insert the comments that we don't yet know about
      return db.bulkAsync({docs: docs}, {}).then(function () {
        console.log('uploaded ' + docs.length + ' comments');
        return arguments;
      });
    });
  }
}
