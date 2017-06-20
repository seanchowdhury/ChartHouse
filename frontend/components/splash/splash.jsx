import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class Splash extends React.Component {

  render() {
    debugger
    return (
      <div>
        Here to join?
        <ul className="login-links">
          <li>
            <Link to='/signup'>Sign up with Email</Link>
          </li>
          <li>
            <Link to='login'>Log in</Link>
          </li>
        </ul>
      </div>
  );}

}

export default Splash;
