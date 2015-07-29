var React = require('react');

var Insights = React.createClass({
  render: function () {
    var tree = this.props.insights.tree;
    var categories = tree.children.map(c => <Category name={c.name} children={c.children} />);
    return (
      <div className='insights'>
        {categories}
      </div>
    );
  }
});

var Category = React.createClass({
  render: function () {
    var childData = this.props.children.map(c => <Data name={c.name} percentage={c.percentage} children={c.children} level={0} />);
    return (
      <div className='insight-category'>
        <h3 className='category-name'>{this.props.name}</h3>
        {childData}
      </div>
    );
  }
});

var Data = React.createClass({
  render: function () {
    var childData;
    if (this.props.children) {
      childData  = this.props.children.map(c => <Data name={c.name} percentage={c.percentage} children={c.children} level={this.props.level + 1} />);
    }
    var name;
    switch (this.props.level) {
      case 0:
        name = <h4 className='data-name'>{this.props.name}</h4>;
        break;

      case 1:
        name = <h5 className='data-name'>{this.props.name}</h5>;
        break;

      default:
        name = <div className='data-name'>{this.props.name}</div>;
    }
    return (
      <div className='insight-subcategory'>
        <div className='insight-data'>
          {name}
          <div className='data-percentile'>{(this.props.percentage * 100).toPrecision(4) + '%'}</div>
        </div>
        {childData}
      </div>
    );
  }
});

module.exports = Insights;