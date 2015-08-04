import React          from 'react';
import Actions        from '../Actions';
import RouteConstants from '../constants/RouteConstants';
import classNames     from 'classnames';
import Router         from 'react-router';
var Link = Router.Link;

var tabActions = [{
  display: 'all',
  to: RouteConstants.ROUTE_ALL
}, {
  display: 'today',
  to: RouteConstants.ROUTE_TODAY
}, {
  display: 'yesterday',
  to: RouteConstants.ROUTE_YESTERDAY
}, {
  display: 'this week',
  to: RouteConstants.ROUTE_THIS_WEEK
}, {
  display: 'last week',
  to: RouteConstants.ROUTE_LAST_WEEK
}, {
  display: 'this month',
  to: RouteConstants.ROUTE_THIS_MONTH
}];

class Tab extends React.Component {
  render () {
    var classes = classNames('tab', {
      open: this.props.open
    });
    return (
      <li className={classes}>
        <Link to="comments" params={{range: this.props.to}}>{this.props.display}</Link>
      </li>
    );
  }
};

class TimeTabs extends React.Component {
  render () {
    var tabs = tabActions.map(ta =>
      <Tab display={ta.display} to={ta.to} open={this.props.openTab === ta.display} />
    );
    return <ul className='time-tabs'>{tabs}</ul>;
  }
};

module.exports = TimeTabs;