var React = require('react');

var Comment = React.createClass({
  render: function () {
    var comment = this.props.comment.value || this.props.comment.fields;
    return (
      <div className="comment">
        <h5 className="comment-body">{'"' + comment.body + '"'}</h5>
        <h6 className="comment-author">{'- '  + comment.author + ', ' + comment.score}</h6>
      </div>
    );
  }
});

module.exports = Comment;