var _Store = require('./_Store');
var Dispatcher = require('../Dispatcher');
var Constants = require('../constants/Constants');
var assign = require('object-assign');

var _botsAndPercentages = [];
var _currentCategory = '';
var _loading = false;
var _description = '';

function setData (newData) {
  _botsAndPercentages = newData;
}

function setCategory (newCategory) {
  _currentCategory = newCategory;
}

function setLoading (newState) {
  _loading = newState;
}

function setDescription (newDescription) {
  _description = newDescription;
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
  },

  getDescription: function () {
    return _description;
  }
});

Dispatcher.register(function(action) {
  switch(action.actionType) {
    case Constants.CATEGORY_LOADING:
      setCategory(action.category);
      setData([]);
      setLoading(true);
      setDescription('');
      CategoryStore.emitChange();
      break;

    case Constants.CATEGORY_DATA:
      setData(action.bots.rows);
      setLoading(false);
      setDescription(action.bots.description);
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
