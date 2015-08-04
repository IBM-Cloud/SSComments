import React from 'react';

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
    var childData = this.props.children.map(c => this.getChildData(c.name, c.percentage, c.children, 0));
    return (
      <div className='insight-category'>
        <h3 className='category-name'>{this.props.name}</h3>
        {childData}
      </div>
    );
  }

  getChildData (name, percentage, children, level) {
    var childData;
    if (children) {
      childData  = children.map(c => this.getChildData(c.name, c.percentage, c.children, level + 1));
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
        <div className='insight-data'>
          {name}
          <div className='data-percentile'>{(percentage * 100).toPrecision(4) + '%'}</div>
        </div>
        {childData}
      </div>
    );
  }
};

module.exports = Insights;