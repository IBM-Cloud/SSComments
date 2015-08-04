import React from 'react';
import Router from 'react-router';
var Link = Router.Link;

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

class Author extends React.Component {
  render () {
    return (
      <div className='bot'>
        <span className='rank'>{this.props.rank}</span>
        <Link className='author' to="author" params={{authorid: this.props.author}}>{this.props.author}</Link>
        <span className='percentile'>{(this.props.percentile * 100).toPrecision(4) + '%'}</span>
      </div>
    );
  }
}

module.exports = CategoryBots;