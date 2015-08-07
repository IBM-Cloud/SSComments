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

import React  from 'react';
import Author from './Author';

class CategoryBots extends React.Component {
  render () {
    var internals;
    if (this.props.isLoading) {
      return <div className='loading'>category loading</div>
    } else {
      return (
        <div className='bots-table'>
          {this.props.botsAndPercentages.map((b, i) => <Author author={b.id} rank={i + 1} percentile={b.order[0]} />)}
        </div>
      );
    }
  }
}

module.exports = CategoryBots;