var _Store = require('./_Store');
var Dispatcher = require('../Dispatcher');
var Constants = require('../Constants');
var assign = require('object-assign');

var botsWithInsights = [];
var selectedBot;
var botInsights = {};
// one of 'no-bot', 'insights-available', 'loading-insights', or 'no-insights-available'
var status = 'no-bot';

function selectBot (bot) {
  selectedBot = bot;
  if (!bot) {
    setStatus(Constants.BOT_STATUS_NO_BOT);
  } else if (botsWithInsights.indexOf(bot) === -1) {
    setStatus(Constants.BOT_STATUS_NO_INSIGHTS_AVAILABLE);
  }
}

function setStatus (newStatus) {
  status = newStatus;
}

function setInsights (newInsights) {
  botInsights = newInsights;
}

var BotStore = assign({}, _Store, {
  getSelectedBot: function () {
    return selectedBot;
  },

  getStatus: function () {
    return status;
  },

  getInsights: function () {
    return botInsights;
  }
});

Dispatcher.register(function(action) {
  switch(action.actionType) {
    case Constants.SELECT_BOT:
      selectBot(action.bot);
      BotStore.emitChange();
      break;

    case Constants.INSIGHTS_LOADING:
      setStatus(Constants.BOT_STATUS_INSIGHTS_LOADING);
      BotStore.emitChange();
      break;

    case Constants.INSIGHTS_DATA:
      setStatus(Constants.BOT_STATUS_INSIGHTS_LOADED);
      setInsights(action.insights);
      BotStore.emitChange();
      break;

    case Constants.BOTS_WITH_INSIGHTS:
      botsWithInsights = action.bots;
      break;

    default:
      // no op
  }
});

module.exports = BotStore;
