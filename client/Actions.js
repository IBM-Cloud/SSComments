var Dispatcher = require('./Dispatcher');
var Constants = require('./Constants');
var requester = require('./requester');

var Actions = {
  loadAllComments: function () {
    Dispatcher.dispatch({ actionType: Constants.TAB_SWITCH_ALL });
    Dispatcher.dispatch({ actionType: Constants.COMMENTS_LOADING_START });
    requester.loadComments().then(comments => {
      Dispatcher.dispatch({ actionType: Constants.COMMENTS_DATA, comments: comments });
    });
  },

  loadTodayComments: function () {
    Dispatcher.dispatch({ actionType: Constants.TAB_SWITCH_TODAY });
    Dispatcher.dispatch({ actionType: Constants.COMMENTS_LOADING_START });
    requester.loadComments('today').then(comments => {
      Dispatcher.dispatch({ actionType: Constants.COMMENTS_DATA, comments: comments });
    });
  },

  loadYesterdayComments: function () {
    Dispatcher.dispatch({ actionType: Constants.TAB_SWITCH_YESTERDAY });
    Dispatcher.dispatch({ actionType: Constants.COMMENTS_LOADING_START });
    requester.loadComments('yesterday').then(comments => {
      Dispatcher.dispatch({ actionType: Constants.COMMENTS_DATA, comments: comments });
    });
  },

  loadThisWeekComments: function () {
    Dispatcher.dispatch({ actionType: Constants.TAB_SWITCH_THIS_WEEK });
    Dispatcher.dispatch({ actionType: Constants.COMMENTS_LOADING_START });
    requester.loadComments('thisweek').then(comments => {
      Dispatcher.dispatch({ actionType: Constants.COMMENTS_DATA, comments: comments });
    });
  },

  loadLastWeekComments: function () {
    Dispatcher.dispatch({ actionType: Constants.TAB_SWITCH_LAST_WEEK });
    Dispatcher.dispatch({ actionType: Constants.COMMENTS_LOADING_START });
    requester.loadComments('lastweek').then(comments => {
      Dispatcher.dispatch({ actionType: Constants.COMMENTS_DATA, comments: comments });
    });
  },

  loadThisMonthComments: function () {
    Dispatcher.dispatch({ actionType: Constants.TAB_SWITCH_THIS_MONTH });
    Dispatcher.dispatch({ actionType: Constants.COMMENTS_LOADING_START });
    requester.loadComments('thismonth').then(comments => {
      Dispatcher.dispatch({ actionType: Constants.COMMENTS_DATA, comments: comments });
    });
  }
}

module.exports = Actions;
