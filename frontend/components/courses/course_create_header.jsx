import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';

class CourseCreateHeader extends React.Component {
  render() {
    return (<div className='cc-header'>
      <ul className='cc-header-left'>
        <li><Link to='/'>AHOY</Link></li>
        <li>COURSE CONSTRUCTOR MAXIMUM ULTRA VIOLET SODA ENERGY - BETA</li>
      </ul>
      <Link to='/mycourses'>Exit Builder</Link>
    </div>
  );
  }
}

export default CourseCreateHeader;
