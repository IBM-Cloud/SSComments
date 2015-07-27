var db = require('./db');
var Promise = require('bluebird');
var rawjs = require('raw.js');
var reddit = Promise.promisifyAll(new rawjs("SubredditSimulatorCommentAggregator"));

/**
 * Get comments from /comments and put them cloudant
 * @param {String} after - optional, an id to start "after" - for pagination
 */
var count;
function addCommentsToCloudant (after, link) {
  console.log('getting more comments...');
  // first we get some comments from reddit
  var redditargs = {r: 'SubredditSimulator', limit: 100};
  if (link) {
    redditargs['link'] = link;
    redditargs['sort'] = 'new';
    redditargs['depth'] = 3;
    console.log('link: ' + link);
  }
  if (after) {
    redditargs['after'] = 't1_' + after;
    redditargs['count'] = count;
    console.log('after: ' + after);
  } else {
    count = 0;
  }
  console.log('count: ' + count);

  var rawComments;
  return reddit.commentsAsync(redditargs).then(function (res) {
    rawComments = res.length ? res[0].data.children : res.data.children;
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
    if (nextIdToGet) {
      setTimeout(function () { addCommentsToCloudant(nextIdToGet, link); }.bind(this), 2000);
    }
  }).catch(function (e) {
    console.error(e);
  });
}

/**
 * Get the 100 newest posts, and then get the comments for 'em
 */
var posts, j = 0;
function addNewPostsToCloudant () {
  console.log('getting comments from posts...');
  var redditargs = {r: 'SubredditSimulator'};
  return reddit.newAsync(redditargs).then(function (args) {
    posts = args.children;
    for (var i = 0; i < posts.length; i++) {
      // kick 'em off every 20 seconds
      // TODO - have good promise handling in addCommentsToCloudant so we can chain these instead
      setTimeout(function () { addCommentsToCloudant(null, posts[j++].data.id)}.bind(this), i*4000);
    }
    // var post = posts[posts.length - 1].data;
    // return addCommentsToCloudant(null, post.id);
  }).catch(function (e) {
    console.error(e);
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
  });
}

module.exports = {
  addCommentsToCloudant: addCommentsToCloudant,
  addNewPostsToCloudant: addNewPostsToCloudant
}