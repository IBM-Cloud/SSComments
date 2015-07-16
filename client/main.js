var React = require('react');
var requester = require('./requester');
var Comment = require('./Comment');

var SSComments = React.createClass({
  getInitialState: function () {
    return {comments: []}
  },

  render: function () {
    var comments = this.state.comments.map(c => <Comment comment={c} />);
    return (
      <div className="ss-comments">
        <h1>Subreddit Simulator Comment Town</h1>
        {comments}
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