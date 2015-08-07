//------------------------------------------------------------------------------
// Copyright IBM Corp. 2015
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------

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
