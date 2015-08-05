import React        from 'react';
import AuthorBody   from './AuthorBody';
import InsightsStore     from '../stores/InsightsStore';
import Actions      from '../Actions';

class AuthorPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = this._getStateObj();
    this._onChange = e => this.setState(this._getStateObj());
  }

  render () {
    return (
      <div className="page author-page">
        <h2 className="ss-author-header">{this.state.selectedBot}</h2>
         <a href={"http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/personality-insights/overview.shtml#overview"} target='_blank'>what does any of this mean?</a>
        <AuthorBody selectedBot={this.state.selectedBot} botStatus={this.state.botStatus} insights={this.state.insights} />
      </div>
    );
  }

  /** When first in the page, set up change handlers */
  componentDidMount () {
    InsightsStore.addChangeListener(this._onChange);
  }

  /** The state for this page */
  _getStateObj () {
    return {
      selectedBot: InsightsStore.getSelectedBot(),
      botStatus: InsightsStore.getStatus(),
      insights: InsightsStore.getInsights()
    }
  }

  /** When removing, clean up change handlers */
  componentWillUnmount () {
    InsightsStore.removeChangeListener(this._onChange);
  }
}

module.exports = AuthorPage;
