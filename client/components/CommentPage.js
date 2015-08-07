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

import React       from 'react';
import CommentList from './CommentList';
import TimeTabs    from './TimeTabs';
import PageStore      from '../stores/PageStore';
import CommentStore   from '../stores/CommentStore';

class CommentPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = this._getStateObj();
    this._onChange = e => this.setState(this._getStateObj());
  }

  render () {
    return (
      <div className="page comment-page">
        <TimeTabs openTab={this.state.openTab} />
        <CommentList comments={this.state.comments} />
      </div>
    );
  }

  /** When first in the page, set up change handlers */
  componentDidMount () {
    CommentStore.addChangeListener(this._onChange);
    PageStore.addChangeListener(this._onChange);
  }

  /** The state for this page */
  _getStateObj () {
    return {
      comments: CommentStore.getComments(),
      openTab: PageStore.getOpenTab()
    }
  }

  /** When removing, clean up change handlers */
  componentWillUnmount () {
    CommentStore.removeChangeListener(this._onChange);
    PageStore.removeChangeListener(this._onChange);
  }
}

module.exports = CommentPage;
