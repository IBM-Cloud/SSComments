var React = require('react');
var requester = require('./requester');
var CommentList = require('./components/CommentList');
var TimeTabs = require('./components/TimeTabs');
var Actions = require('./Actions');
var CommentStore = require('./CommentStore');

var SSComments = React.createClass({
  getInitialState: function () {
    return this._getStateObj();
  },

  render: function () {
    return (
      <div className='ss-comments'>
        <h1 className='ss-title'>Subreddit Simulator Top Comments</h1>
        <TimeTabs openTab={this.state.openTab} />
        <CommentList comments={this.state.comments} />
      </div>
    );
  },

  componentDidMount: function () {
    CommentStore.addChangeListener(this._onChange);
    Actions.loadAllComments();
  },

  componentWillUnmount: function () {
    CommentStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState(this._getStateObj());
  },

  _getStateObj: function () {
    return {
      comments: CommentStore.getComments(),
      openTab: CommentStore.getOpenTab()
    }
  }
});

React.render(<SSComments />, document.body);