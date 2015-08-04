import React   from 'react';
import Comment from './Comment';

class CommentList extends React.Component {
  render () {
    var comments = this.props.comments.map(c => <Comment comment={c} key={c.id} />);
    return <div className='comment-list'>{comments}</div>;
  }
};

module.exports = CommentList;