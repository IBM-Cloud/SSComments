var React = require('react');
var requester = require('./requester');
var Actions = require('./Actions');
var PageStore = require('./stores/PageStore');
var CommentStore = require('./stores/CommentStore');
var BotStore = require('./stores/BotStore');
var Constants = require('./Constants');
// components
var CommentList = require('./components/CommentList');
var TimeTabs = require('./components/TimeTabs');
var AuthorHeader = require('./components/AuthorHeader');
var AuthorBody = require('./components/AuthorBody');

var SSComments = React.createClass({
  getInitialState: function () {
    return this._getStateObj();
  },

  render: function () {
    var internals;
    if (this.state.selectedBot) {
      internals = [
        <AuthorHeader selectedBot={this.state.selectedBot} />,
        <AuthorBody selectedBot={this.state.selectedBot} botStatus={this.state.botStatus} insights={this.state.insights} />
      ];
    } else {
      internals = [
        <TimeTabs openTab={this.state.openTab} />,
        <CommentList comments={this.state.comments} />
      ];
    }
    return (
      <div className='ss-comments'>
        <h1 className='ss-title'>Subreddit Simulator Top Comments</h1>
        {internals}
      </div>
    );
  },

  /** When first in the page, set up change handlers, and kick off initial requests */
  componentDidMount: function () {
    // add change listeners for stores
    CommentStore.addChangeListener(this._onChange);
    PageStore.addChangeListener(this._onChange);
    BotStore.addChangeListener(this._onChange);
    // load initial batch of comments and pre-fetch available bots with insights
    Actions.loadAllComments();
    Actions.fetchBotsWithInsights();
  },

  /** When the stores update, re-set our state to trigger a render */
  _onChange: function () {
    this.setState(this._getStateObj());
  },

  /** The state for the app */
  _getStateObj: function () {
    return {
      comments: CommentStore.getComments(),
      openTab: PageStore.getOpenTab(),
      selectedBot: BotStore.getSelectedBot(),
      botStatus: BotStore.getStatus(),
      insights: BotStore.getInsights()
    }
  },

  /** Clean up handlers when removing... this currently will never happen but might as well be safe */
  componentWillUnmount: function () {
    CommentStore.removeChangeListener(this._onChange);
    PageStore.removeChangeListener(this._onChange);
    BotStore.removeChangeListener(this._onChange);
  }
});

// 'https://www.reddit.com/user/' + comment.author + '?sort=top'

React.render(<SSComments />, document.body);