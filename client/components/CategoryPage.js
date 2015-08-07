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

import React         from 'react';
import CategoryBots  from './CategoryBots';
import CategoryStore from '../stores/CategoryStore';
import Actions       from '../Actions';

class CategoryPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = this._getStateObj();
    this._onChange = e => this.setState(this._getStateObj());
  }

  render () {
    return (
      <div className="page category-page">
        <h2 className="category-header">{this.state.category}</h2>
        <div className="category-description">{this.state.description}</div>
        <CategoryBots botsAndPercentages={this.state.botsAndPercentages} isLoading={this.state.isLoading} />
      </div>
    );
  }

  /** When first in the page, set up change handlers */
  componentDidMount () {
    CategoryStore.addChangeListener(this._onChange);
  }

  /** The state for this page */
  _getStateObj () {
    return {
      botsAndPercentages: CategoryStore.getData(),
      category: CategoryStore.getCurrentCategory(),
      isLoading: CategoryStore.getLoading(),
      description: CategoryStore.getDescription()
    }
  }

  /** When removing, clean up change handlers */
  componentWillUnmount () {
    CategoryStore.removeChangeListener(this._onChange);
  }
}

module.exports = CategoryPage;
