import React        from 'react';
import AuthorBody   from './AuthorBody';
import AuthorHeader from './AuthorHeader';
import BotStore     from '../stores/BotStore';
import Actions      from '../Actions';

class CommentPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = this._getStateObj();
    this._onChange = e => this.setState(this._getStateObj());
  }

  render () {
    return (
      <div className="page author-page">
        <AuthorHeader selectedBot={this.state.selectedBot} />
        <AuthorBody selectedBot={this.state.selectedBot} botStatus={this.state.botStatus} insights={this.state.insights} />
      </div>
    );
  }

  /** When first in the page, set up change handlers */
  componentDidMount () {
    BotStore.addChangeListener(this._onChange);
  }

  /** The state for this page */
  _getStateObj () {
    return {
      selectedBot: BotStore.getSelectedBot(),
      botStatus: BotStore.getStatus(),
      insights: BotStore.getInsights()
    }
  }

  /** When removing, clean up change handlers */
  componentWillUnmount () {
    BotStore.removeChangeListener(this._onChange);
  }
}

module.exports = CommentPage;
