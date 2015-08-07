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

import React from 'react';
import Router  from 'react-router';
var Link = Router.Link;

class Insights extends React.Component {
  render () {
    var tree = this.props.insights.tree;
    var categories = tree.children.map(c => <Category name={c.name} children={c.children} />);
    return (
      <div className='insights'>
        {categories}
      </div>
    );
  }
};

class Category extends React.Component {
  render () {
    var childData = this.props.children.map(c => this.getChildData(c.name, c.percentage, c.children, c.id, 0));
    return (
      <div className='insight-category'>
        <h3 className='category-name'>{this.props.name}</h3>
        {childData}
      </div>
    );
  }

  getChildData (name, percentage, children, id, level) {
    var childData;
    if (children) {
      childData  = children.map(c => this.getChildData(c.name, c.percentage, c.children, c.id, level + 1));
      if (children.some(c => c.name === name && c.percentage === percentage)) {
        return {childData};
      }
    }
    var name;
    switch (level) {
      case 0:
        name = <h4 className='data-name'>{name}</h4>;
        break;

      case 1:
        name = <h5 className='data-name'>{name}</h5>;
        break;

      default:
        name = <div className='data-name'>{name}</div>;
    }
    return (
      <div className='insight-subcategory'>
        <Link className='insight-data' to="category" params={{categoryid: id}}>
          {name}
          <div className='data-percentile'>{(percentage * 100).toPrecision(4) + '%'}</div>
        </Link>
        {childData}
      </div>
    );
  }
};

module.exports = Insights;