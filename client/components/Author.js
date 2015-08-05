import React from 'react';
import Router from 'react-router';
var Link = Router.Link;

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

module.exports = Author;
