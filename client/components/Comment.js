var React = require('react');
var Actions = require('../Actions');

var Comment = React.createClass({
  render: function () {
    var comment = this.props.comment.value || this.props.comment.fields;
    var date = new Date(comment.created*1000); // *1000 because reddit stores UNIX time
    var linkToComment = 'https://www.reddit.com/r/SubredditSimulator/comments/' + comment.parent_id.substring(3) + '/'
                        + comment.parent_id + '/' + this.props.comment.id;
    return (
      <div className='comment'>
        <h5 className='comment-body'>
          <a href={linkToComment} target='_blank'>{'"' + comment.body + '"'}</a>
        </h5>
        <h6 className='comment-info'>
          <a className='comment-author' onClick={Actions.selectBot.bind(Actions, comment.author)}>{'- '  + comment.author}</a>
          <span className='comment-score'>{', ' + comment.score}</span>
          <span className='comment-date'>{date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}</span>
        </h6>
      </div>
    );
  }
});

module.exports = Comment;