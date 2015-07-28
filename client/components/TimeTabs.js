var React = require('react');
var Actions = require('../Actions');
var classNames = require('classnames');

var tabActions = [{
  display: 'all',
  action: Actions.loadAllComments
}, {
  display: 'today',
  action: Actions.loadTodayComments
}, {
  display: 'yesterday',
  action: Actions.loadYesterdayComments
}, {
  display: 'this week',
  action: Actions.loadThisWeekComments
}, {
  display: 'last week',
  action: Actions.loadLastWeekComments
}, {
  display: 'this month',
  action: Actions.loadThisMonthComments
}];

var Tab = React.createClass({
  render: function () {
    var classes = classNames('tab', {
      open: this.props.open
    });
    return (
      <li className={classes}>
        <span onClick={this.props.action}>{this.props.display}</span>
      </li>
    );
  }
});

var TimeTabs = React.createClass({
  render: function () {
    var tabs = tabActions.map(ta => <Tab display={ta.display} action={ta.action} open={this.props.openTab === ta.display} />);
    return <ul className='time-tabs'>{tabs}</ul>;
  }
});

module.exports = TimeTabs;