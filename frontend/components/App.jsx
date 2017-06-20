import React from 'react';
import { Provider } from 'react-redux';
import {
  Route,
  Redirect,
  Switch,
  Link,
  HashRouter
} from 'react-router-dom';

import Auth from './auth/auth';
import Splash from './splash/splash';
import DashboardNav from './dashboard/dashboard_header';
import { AuthRoute, ProtectedRoute } from '../util/route_util';


const App = () => (
  <div>
    <Switch>


      <AuthRoute exact path="/" component={Splash} />
      <AuthRoute path="/signup" component={Auth} />
      <AuthRoute path="/login" component={Auth} />
      <ProtectedRoute path="/dashboard" component={DashboardNav} />
    </Switch>
  </div>
);

export default App;
