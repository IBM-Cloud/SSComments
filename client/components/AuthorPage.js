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

import React        from 'react';
import AuthorBody   from './AuthorBody';
import InsightsStore     from '../stores/InsightsStore';
import Actions      from '../Actions';

class AuthorPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = this._getStateObj();
    this._onChange = e => this.setState(this._getStateObj());
  }

  render () {
    return (
      <div className="page author-page">
        <h2 className="ss-author-header">{this.state.selectedBot}</h2>
         <a href={"http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/personality-insights/overview.shtml#overview"} target='_blank'>what does any of this mean?</a>
        <AuthorBody selectedBot={this.state.selectedBot} botStatus={this.state.botStatus} insights={this.state.insights} />
      </div>
    );
  }

  /** When first in the page, set up change handlers */
  componentDidMount () {
    InsightsStore.addChangeListener(this._onChange);
  }

  /** The state for this page */
  _getStateObj () {
    return {
      selectedBot: InsightsStore.getSelectedBot(),
      botStatus: InsightsStore.getStatus(),
      insights: InsightsStore.getInsights()
    }
  }

  /** When removing, clean up change handlers */
  componentWillUnmount () {
    InsightsStore.removeChangeListener(this._onChange);
  }
}

module.exports = AuthorPage;
