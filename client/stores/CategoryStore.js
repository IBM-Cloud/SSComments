var _Store = require('./_Store');
var Dispatcher = require('../Dispatcher');
var Constants = require('../constants/Constants');
var assign = require('object-assign');

var _botsAndPercentages = [];
var _currentCategory = '';
var _loading = false;

function setData (newData) {
  _botsAndPercentages = newData.rows;
}

function setCategory (newCategory) {
  _currentCategory = newCategory;
}

function setLoading (newState) {
  _loading = newState;
}

var CategoryStore = assign({}, _Store, {
  getData: function () {
    return _botsAndPercentages;
  },

  getCurrentCategory: function () {
    return _currentCategory;
  },

  getLoading: function () {
    return _loading;
  }
});

Dispatcher.register(function(action) {
  switch(action.actionType) {
    case Constants.CATEGORY_LOADING:
      setCategory(action.category);
      setData([]);
      setLoading(true);
      CategoryStore.emitChange();
      break;

    case Constants.CATEGORY_DATA:
      setData(action.bots);
      setLoading(false);
      CategoryStore.emitChange();
      break;

    case Constants.CATEGORY_ERROR:
      setLoading(false);
      CategoryStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = CategoryStore;
