//------------------------------------------------------------------------------
// Copyright IBM Corp. 2015
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------

import React   from 'react';
import Actions from '../Actions';
import Router  from 'react-router';
var Link = Router.Link;

class Comment extends React.Component {
  render () {
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
          <Link className='comment-author' to="author" params={{authorid: comment.author}}>{'- '  + comment.author}</Link>
          <span className='comment-score'>{', ' + comment.score}</span>
          <span className='comment-date'>{date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}</span>
        </h6>
      </div>
    );
  }
};

module.exports = Comment;