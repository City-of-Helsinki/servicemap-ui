
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Home = () => (
  <div>
    <Helmet>
      <title>Home page</title>
    </Helmet>
    <p>This is homepage</p>
  </div>
);

const Other = () => (
  <div>
    <Helmet>
      <title>Other page</title>
    </Helmet>
    <p>This is other</p>
  </div>
);

export default () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/other" component={Other} />
  </Switch>

);
