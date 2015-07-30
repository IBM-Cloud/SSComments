var React = require('react');
var Constants = require('../Constants');
var Insights = require('./Insights');

var AuthorBody = React.createClass({
  render: function () {
    var internals;
    if (this.props.botStatus === Constants.BOT_STATUS_INSIGHTS_LOADING) {
      internals = <div className='status-message'>insights loading</div>;
    } else if (this.props.botStatus === Constants.BOT_STATUS_NO_INSIGHTS_AVAILABLE) {
      internals = <div className='status-message'>no insights available</div>;
    } else if (this.props.botStatus === Constants.BOT_STATUS_INSIGHTS_LOADED) {
      internals = <Insights insights={this.props.insights} />;
    }
    return (
      <div className='ss-author-deets'>
        <a href={'https://www.reddit.com/user/' + this.props.selectedBot + '?sort=top'} target='_blank'>Reddit Profile</a>
        {internals}
      </div>
    );
  }
});

module.exports = AuthorBody;