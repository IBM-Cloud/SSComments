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
