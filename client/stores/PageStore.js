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

    default:
      // no op
  }
});

module.exports = PageStore;
