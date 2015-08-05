var _Store = require('./_Store');
var Dispatcher = require('../Dispatcher');
var Constants = require('../constants/Constants');
var assign = require('object-assign');

var selectedBot;
var botInsights = {};
var status = Constants.BOT_STATUS_NO_BOT;
var allInsights = [];

function selectBot (bot) {
  selectedBot = bot;
  if (!bot) {
    setStatus(Constants.BOT_STATUS_NO_BOT);
  }
}

function setStatus (newStatus) {
  status = newStatus;
}

function setInsights (newInsights) {
  botInsights = newInsights;
}

function setAllInsights (newInsights) {
  allInsights = newInsights;
}

var InsightsStore = assign({}, _Store, {
  getSelectedBot: function () {
    return selectedBot;
  },

  getStatus: function () {
    return status;
  },

  getInsights: function () {
    return botInsights;
  },

  getAllInsights: function () {
    return allInsights;
  }
});

Dispatcher.register(function(action) {
  switch(action.actionType) {
    case Constants.SELECT_BOT:
      selectBot(action.bot);
      InsightsStore.emitChange();
      break;

    case Constants.INSIGHTS_LOADING:
      setStatus(Constants.BOT_STATUS_INSIGHTS_LOADING);
      InsightsStore.emitChange();
      break;

    case Constants.INSIGHTS_DATA:
      setStatus(Constants.BOT_STATUS_INSIGHTS_LOADED);
      setInsights(action.insights);
      InsightsStore.emitChange();
      break;

    case Constants.ALL_INSIGHTS_DATA:
      setAllInsights(action.insights);
      InsightsStore.emitChange();
      break;

    case Constants.INSIGHTS_ERROR:
      if (action.error.status === 404) {
        setStatus(Constants.BOT_STATUS_NO_INSIGHTS_AVAILABLE);
        InsightsStore.emitChange();
      }
      break;

    default:
      // no op
  }
});

module.exports = InsightsStore;
