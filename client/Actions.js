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

var Dispatcher = require('./Dispatcher');
var Constants = require('./constants/Constants');
var requester = require('./requester');

var Actions = {
  selectBot: function (bot) {
    Dispatcher.dispatch({ actionType: Constants.SELECT_BOT, bot: bot});
    if (bot) {
      this.loadInsights(bot);
    }
  },

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
  },

  loadAllInsights: function () {
    Dispatcher.dispatch({ actionType: Constants.TAB_SWITCH_INSIGHTS });
    requester.fetchAllInsights().then(insights => {
      Dispatcher.dispatch({ actionType: Constants.ALL_INSIGHTS_DATA, insights: insights });
    });
  },

  fetchBotsWithInsights: function () {
    requester.fetchBotsWithInsights().then(bots => {
      botsWithInsights = bots;
      Dispatcher.dispatch({ actionType: Constants.BOTS_WITH_INSIGHTS, bots: bots });
    })
  },

  loadInsights: function (bot) {
    Dispatcher.dispatch({ actionType: Constants.INSIGHTS_LOADING });
    requester.fetchInsights(bot).then(insights => {
      Dispatcher.dispatch({ actionType: Constants.INSIGHTS_DATA, insights: insights });
    }).catch(e => {
      Dispatcher.dispatch({ actionType: Constants.INSIGHTS_ERROR, error: e });
    });
  },

  loadCategory: function (category) {
    Dispatcher.dispatch({ actionType: Constants.CATEGORY_LOADING, category: category });
    requester.fetchBotsByCategory(category).then(bots => {
      Dispatcher.dispatch({ actionType: Constants.CATEGORY_DATA, bots: bots });
    }).catch(e => {
      Dispatcher.dispatch({ actionType: Constants.CATEGORY_ERROR, error: e });
    });
  }
}

module.exports = Actions;
