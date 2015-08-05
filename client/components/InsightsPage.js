import React               from 'react';
import TimeTabs            from './TimeTabs';
import InsightCategoryList from './InsightCategoryList';
import PageStore           from '../stores/PageStore';
import InsightsStore       from '../stores/InsightsStore';

class InsightsPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = this._getStateObj();
    this._onChange = e => this.setState(this._getStateObj());
  }

  render () {
    return (
      <div className="page insights-page">
        <TimeTabs openTab={this.state.openTab} />
        <InsightCategoryList allInsights={this.state.allInsights} />
      </div>
    );
  }

  /** When first in the page, set up change handlers */
  componentDidMount () {
    PageStore.addChangeListener(this._onChange);
    InsightsStore.addChangeListener(this._onChange);
  }

  /** The state for this page */
  _getStateObj () {
    return {
      openTab: PageStore.getOpenTab(),
      allInsights: InsightsStore.getAllInsights()
    }
  }

  /** When removing, clean up change handlers */
  componentWillUnmount () {
    PageStore.removeChangeListener(this._onChange);
  }
}

module.exports = InsightsPage;
