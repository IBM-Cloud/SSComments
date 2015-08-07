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
import Router from 'react-router';
var Link = Router.Link;

class InsightCategory extends React.Component {
  render () {
    var bots = this.props.rows.map((r, i) => <Author author={r.id} rank={i + 1} percentile={r.order[0]} /> );
    return (
      <div className='insight-category'>
        <Link className='insight-data' to="category" params={{categoryid: this.props.category}}>
          <h4>{this.props.category}</h4>
        </Link>
        <h5>{this.props.description}</h5>
        {bots}
      </div>
    );
  }
}

class InsightCategoryList extends React.Component {
  render () {
    var insights = this.props.allInsights.map(ins =>
      <InsightCategory category={ins.category} description={ins.description} rows={ins.rows} />
    );
    return (
      <div className='insight-category-list'>
        {insights}
      </div>
    );
  }
}

module.exports = InsightCategoryList;
