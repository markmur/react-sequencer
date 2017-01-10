import 'styles/app.scss';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from 'components/App/App';
import NotFound from 'components/NotFound/NotFound';

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App} />
    <Route path="/*" component={NotFound} />
  </Router>
);

render(routes, document.getElementById('app'));
