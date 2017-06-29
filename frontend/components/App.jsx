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
import CoursesIndex from './courses/courses_index';
import CourseCreate from './courses/course_create';
import CourseShow from './courses/course_show';
import ChartCreate from './charts/chart_create';
import ChartShow from './charts/chart_show';
import { AuthRoute, ProtectedRoute } from '../util/route_util';


const App = () => (
  <div>
    <Switch>
      <AuthRoute exact path="/" component={Splash} />
      <AuthRoute path="/signup" component={Auth} />
      <AuthRoute path="/login" component={Auth} />
      <ProtectedRoute path="/dashboard" component={DashboardNav} />
      <ProtectedRoute exact path="/courses" component={CoursesIndex} />
      <ProtectedRoute exact path="/courses/:courseId" component={CourseShow} />
      <ProtectedRoute exact path="/charts/:chartId" component={ChartShow} />
      <ProtectedRoute path="/newcourse" component={CourseCreate} />
      <ProtectedRoute path="/newchart" component={ChartCreate} />
    </Switch>
  </div>
);

export default App;
