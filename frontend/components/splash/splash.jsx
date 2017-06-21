import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class Splash extends React.Component {

  render() {
    return (
      <div className='splash-page'>
        <div className='splash-header'>
          <ul className="login-links">
            <li className='join-now'>Here to join?</li>
            <li>
              <Link to='/signup' className='splash-link'>Sign up with Email</Link>
            </li>
            <li>
              <Link to='login' className='splash-link'>Log in</Link>
            </li>
          </ul>
        </div>
      </div>
  );}

}

export default Splash;
