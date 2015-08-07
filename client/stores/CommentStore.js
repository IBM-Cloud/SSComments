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

var _comments = [];

function setComments (newComments) {
  _comments = newComments;
}

function clearComments () {
  _comments = [];
}

var CommentStore = assign({}, _Store, {
  /** Get the entire collection of Comments */
  getComments: function() {
    return _comments;
  }
});

Dispatcher.register(function(action) {
  switch(action.actionType) {
    case Constants.COMMENTS_LOADING_START:
      clearComments();
      CommentStore.emitChange();
      break;

    case Constants.COMMENTS_DATA:
      setComments(action.comments);
      CommentStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = CommentStore;
