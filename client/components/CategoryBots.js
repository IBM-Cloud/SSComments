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