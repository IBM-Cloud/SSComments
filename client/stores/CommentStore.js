var _Store = require('./_Store');
var Dispatcher = require('../Dispatcher');
var Constants = require('../constants/Constants');
var assign = require('object-assign');

var _comments = [];

function setComments (newComments) {
  _comments = newComments;
}

function clearComments () {
  _comments = [];
}

var CommentStore = assign({}, _Store, {
  /** Get the entire collection of Comments */
  getComments: function() {
    return _comments;
  }
});

Dispatcher.register(function(action) {
  switch(action.actionType) {
    case Constants.COMMENTS_LOADING_START:
      clearComments();
      CommentStore.emitChange();
      break;

    case Constants.COMMENTS_DATA:
      setComments(action.comments);
      CommentStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = CommentStore;
