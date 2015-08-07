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

var keyMirror = require('keymirror');

module.exports = keyMirror({
  COMMENTS_LOADING_START: null,
  COMMENTS_DATA: null,
  TAB_SWITCH_TODAY: null,
  TAB_SWITCH_YESTERDAY: null,
  TAB_SWITCH_THIS_WEEK: null,
  TAB_SWITCH_LAST_WEEK: null,
  TAB_SWITCH_THIS_MONTH: null,
  TAB_SWITCH_ALL: null,
  TAB_SWITCH_INSIGHTS: null,
  BOTS_WITH_INSIGHTS: null,
  ALL_INSIGHTS_DATA: null,
  INSIGHTS_LOADING: null,
  INSIGHTS_DATA: null,
  INSIGHTS_ERROR: null,
  CATEGORY_LOADING: null,
  CATEGORY_DATA: null,
  CATEGORY_ERROR: null,

  BOT_STATUS_INSIGHTS_LOADING: null,
  BOT_STATUS_NO_INSIGHTS_AVAILABLE: null,
  BOT_STATUS_INSIGHTS_LOADED: null,
  BOT_STATUS_NO_BOT: null
});