var Dispatcher = require('./Dispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('./Constants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var _comments = [];
// not worth making a whole store just to manage this piece of state
// it might feel a little hacky for it to be here but trust me it's worth it!
var openTab = 'all';

function setComments (newComments) {
  _comments = newComments;
}

function clearComments () {
  _comments = [];
}

function setOpenTab (newTab) {
  openTab = newTab;
}

var CommentStore = assign({}, EventEmitter.prototype, {
  /** Get the entire collection of Comments */
  getComments: function() {
    return _comments;
  },

  getOpenTab: function () {
    return openTab;
  },

  /** ... emit a change event! */
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /** @param {function} callback */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /** @param {function} callback */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
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

   case Constants.TAB_SWITCH_TODAY:
      setOpenTab('today');
      CommentStore.emitChange();
      break;

   case Constants.TAB_SWITCH_YESTERDAY:
      setOpenTab('yesterday');
      CommentStore.emitChange();
      break;

   case Constants.TAB_SWITCH_THIS_WEEK:
      setOpenTab('this week');
      CommentStore.emitChange();
      break;

   case Constants.TAB_SWITCH_LAST_WEEK:
      setOpenTab('last week');
      CommentStore.emitChange();
      break;

   case Constants.TAB_SWITCH_THIS_MONTH:
      setOpenTab('this month');
      CommentStore.emitChange();
      break;

   case Constants.TAB_SWITCH_ALL:
      setOpenTab('all');
      CommentStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = CommentStore;
