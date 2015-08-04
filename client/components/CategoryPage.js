import React         from 'react';
import CategoryBots  from './CategoryBots';
import CategoryStore from '../stores/CategoryStore';
import Actions       from '../Actions';

class CategoryPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = this._getStateObj();
    this._onChange = e => this.setState(this._getStateObj());
  }

  render () {
    return (
      <div className="page category-page">
        <h2 className="category-header">{this.state.category}</h2>
        <CategoryBots botsAndPercentages={this.state.botsAndPercentages} isLoading={this.state.isLoading} />
      </div>
    );
  }

  /** When first in the page, set up change handlers */
  componentDidMount () {
    CategoryStore.addChangeListener(this._onChange);
  }

  /** The state for this page */
  _getStateObj () {
    return {
      botsAndPercentages: CategoryStore.getData(),
      category: CategoryStore.getCurrentCategory(),
      isLoading: CategoryStore.getLoading()
    }
  }

  /** When removing, clean up change handlers */
  componentWillUnmount () {
    CategoryStore.removeChangeListener(this._onChange);
  }
}

module.exports = CategoryPage;
