var React = require('react');
var requester = require('./requester');
var CommentList = require('./components/CommentList');

var SSComments = React.createClass({
  getInitialState: function () {
    return {comments: []}
  },

  render: function () {
    return (
      <div className="ss-comments">
        <h1>Subreddit Simulator Comment Town</h1>
        <CommentList comments={this.state.comments} />
      </div>
    );
  },

  componentDidMount: function () {
    requester.loadInitialComments().then(function (comments) {
      this.setState({comments: comments});
    }.bind(this));
  }
});

React.render(<SSComments />, document.body);