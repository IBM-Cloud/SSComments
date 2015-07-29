var React = require('react');
var Actions = require('../Actions');

var AuthorHeader = React.createClass({
  render: function () {
    return (
      <div className='ss-author-header'>
        <h2>{this.props.selectedBot}</h2>
        <a className='back' onClick={Actions.selectBot.bind(Actions, null)}>back</a>
      </div>
    );
  }
});

module.exports = AuthorHeader;