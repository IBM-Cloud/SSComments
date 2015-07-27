var React = require('react');
var Comment = require('./Comment');

var CommentList = React.createClass({
  render: function () {
    var comments = this.props.comments.map(c => <Comment comment={c} />);
    return <div className='comment-list'>{comments}</div>;
  }
});

module.exports = CommentList;