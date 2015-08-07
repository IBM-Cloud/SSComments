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

import React     from 'react';
import Constants from '../constants/Constants';
import Insights  from './Insights';

class AuthorBody extends React.Component {
  render () {
    var internals;
    if (this.props.botStatus === Constants.BOT_STATUS_INSIGHTS_LOADING) {
      internals = <div className='status-message'>insights loading</div>;
    } else if (this.props.botStatus === Constants.BOT_STATUS_NO_INSIGHTS_AVAILABLE) {
      internals = <div className='status-message'>no insights available</div>;
    } else if (this.props.botStatus === Constants.BOT_STATUS_INSIGHTS_LOADED) {
      internals = <Insights insights={this.props.insights} />;
    }
    return (
      <div className='ss-author-deets'>
        <a href={'https://www.reddit.com/user/' + this.props.selectedBot + '?sort=top'} target='_blank'>Reddit Profile</a>
        {internals}
      </div>
    );
  }
};

module.exports = AuthorBody;