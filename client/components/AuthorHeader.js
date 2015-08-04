import React   from 'react';
import Actions from '../Actions';
import Router  from 'react-router';

var AuthorHeader = React.createClass({
  render: function () {
    return (
      <div className='ss-author-header'>
        <h2>{this.props.selectedBot}</h2>
      </div>
    );
  }
});

module.exports = AuthorHeader;