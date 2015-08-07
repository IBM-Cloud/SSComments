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

import React          from 'react';
import requester      from './requester';
import Actions        from './Actions';
import Constants      from './constants/Constants';
import RouteConstants from './constants/RouteConstants';
// components
import CommentPage    from './components/CommentPage';
import AuthorPage     from './components/AuthorPage';
import CategoryPage   from './components/CategoryPage';
import InsightsPage   from './components/InsightsPage';
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
      <div className="ss-comments">
        <Link to="app">
          <h1 className="ss-title">Subreddit Simulator Top Comments</h1>
        </Link>
        <RouteHandler />
        <div className="ss-footer">
          <a href="http://www.jkaufman.io/from-the-mouths-of-bots/" target="_blank">An Explanation</a>
          <a href="http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/" target="_blank">Built with IBM Watson</a>
          <a href="https://github.com/IBM-Bluemix/SSComments" target="_blank">Fork me on GitHub</a>
          <a href="http://www.ibm.com/privacy/us/en/" target="_blank">Privacy Policy</a>
          <a href="/tos" target="_blank">Terms of Use</a>
        </div>
      </div>
    );
  }
};

var routes = (
  <Route name="app" path="/" handler={SSComments} >
    <Route name="comments" path="/comments/:range" handler={CommentPage} />
    <Route name="author" path="/author/:authorid" handler={AuthorPage} />
    <Route name="category" path="/category/:categoryid" handler={CategoryPage} />
    <Route name="insights" handler={InsightsPage} />
    <DefaultRoute handler={CommentPage} />
  </Route>
);

/**
 * Perform rendering and actions for different roots
 * The next version of react-router allows for callbacks to be called on specific
 * paths... but until then doing things this way is a-ok. Also takes care of google
 * analytics single-web-page stuffs.
 */
Router.run(routes, (Root, state) => {
  // step 1: render
  React.render(<Root />, document.body)
  // step 2: handle route actions
  var params = state.params;
  // for /comments, handle the loading of comments
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
    ga('send', 'pageview', '/comments/' + (params.range || RouteConstants.ROUTE_ALL));
    ga('set', 'page', '/comments');
  // for /author, handle loading that bots info
  } else if (state.path.indexOf('author') > -1) {
    if (params.authorid) {
      Actions.selectBot(params.authorid);
      ga('send', 'pageview', '/author/' + params.authorid);
      ga('set', 'page', '/author');
    }
  // for /category, handle loading that category's info
  } else if (state.path.indexOf('category') > -1) {
    if (params.categoryid) {
      Actions.loadCategory(params.categoryid);
      ga('send', 'pageview', '/category/' + params.categoryid);
      ga('set', 'page', '/category');
    }
  // for /insights, handle loading them insights
  } else if (state.path.indexOf('insights') > -1) {
    Actions.loadAllInsights();
    ga('send', 'pageview', '/insights');
    ga('set', 'page', '/insights');
  }
});