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

var openTab = 'all';

function setOpenTab (newTab) {
  openTab = newTab;
}

var PageStore = assign({}, _Store, {
  getOpenTab: function () {
    return openTab;
  }
});

Dispatcher.register(function(action) {
  switch(action.actionType) {
   case Constants.TAB_SWITCH_TODAY:
      setOpenTab('today');
      PageStore.emitChange();
      break;

   case Constants.TAB_SWITCH_YESTERDAY:
      setOpenTab('yesterday');
      PageStore.emitChange();
      break;

   case Constants.TAB_SWITCH_THIS_WEEK:
      setOpenTab('this week');
      PageStore.emitChange();
      break;

   case Constants.TAB_SWITCH_LAST_WEEK:
      setOpenTab('last week');
      PageStore.emitChange();
      break;

   case Constants.TAB_SWITCH_THIS_MONTH:
      setOpenTab('this month');
      PageStore.emitChange();
      break;

   case Constants.TAB_SWITCH_ALL:
      setOpenTab('all');
      PageStore.emitChange();
      break;

    case Constants.TAB_SWITCH_INSIGHTS:
      setOpenTab('insights')
      PageStore.emitChange();

    default:
      // no op
  }
});

module.exports = PageStore;
