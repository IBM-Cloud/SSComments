import React          from 'react';
import requester      from './requester';
import Actions        from './Actions';
import Constants      from './constants/Constants';
import RouteConstants from './constants/RouteConstants';
// components
import CommentPage    from './components/CommentPage';
import AuthorPage     from './components/AuthorPage';
// routing
import Router         from 'react-router';
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

class SSComments extends React.Component {
  render () {
    return (
      <div className='ss-comments'>
        <h1 className='ss-title'>Subreddit Simulator Top Comments</h1>
        <RouteHandler />
      </div>
    );
  }
};

var routes = (
  <Route name="app" path="/" handler={SSComments} >
    <Route name="comments" path="/comments/:range" handler={CommentPage} />
    <Route name="author" path="/author/:authorid" handler={AuthorPage} />
    <DefaultRoute handler={CommentPage} />
  </Route>
);

Router.run(routes, (Root, state) => {
  React.render(<Root />, document.body)
  var params = state.params;
  if (state.path.indexOf('comments') > -1 || state.path === '/') {
    switch (params.range) {
      case RouteConstants.ROUTE_TODAY:
        Actions.loadTodayComments();
        break;

      case RouteConstants.ROUTE_YESTERDAY:
        Actions.loadYesterdayComments();
        break;

      case RouteConstants.ROUTE_THIS_WEEK:
        Actions.loadThisWeekComments();
        break;

      case RouteConstants.ROUTE_LAST_WEEK:
        Actions.loadLastWeekComments();
        break;

      case RouteConstants.ROUTE_THIS_MONTH:
        Actions.loadThisMonthComments();
        break;

      case RouteConstants.ROUTE_ALL:
      default:
        Actions.loadAllComments();
        break;
    }
  } else if (state.path.indexOf('author') > -1) {
    if (params.authorid) {
      Actions.selectBot(params.authorid);
    }
  }
});