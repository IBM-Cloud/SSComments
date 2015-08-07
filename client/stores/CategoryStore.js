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
