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

import React               from 'react';
import TimeTabs            from './TimeTabs';
import InsightCategoryList from './InsightCategoryList';
import PageStore           from '../stores/PageStore';
import InsightsStore       from '../stores/InsightsStore';

class InsightsPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = this._getStateObj();
    this._onChange = e => this.setState(this._getStateObj());
  }

  render () {
    return (
      <div className="page insights-page">
        <TimeTabs openTab={this.state.openTab} />
        <InsightCategoryList allInsights={this.state.allInsights} />
      </div>
    );
  }

  /** When first in the page, set up change handlers */
  componentDidMount () {
    PageStore.addChangeListener(this._onChange);
    InsightsStore.addChangeListener(this._onChange);
  }

  /** The state for this page */
  _getStateObj () {
    return {
      openTab: PageStore.getOpenTab(),
      allInsights: InsightsStore.getAllInsights()
    }
  }

  /** When removing, clean up change handlers */
  componentWillUnmount () {
    PageStore.removeChangeListener(this._onChange);
  }
}

module.exports = InsightsPage;
