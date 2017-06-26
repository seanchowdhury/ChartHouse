import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';
import { Dropdown } from './dropdown';

const DashboardMenu = () => (
  <div>
    <li className='dropdown-link'><Link to='/crewactivity'>Activity Feed</Link></li>
    <li className='dropdown-link'><Link to='/courses'>Courses</Link></li>
    </div>
)

class DashboardNav extends React.Component {
  constructor(props) {
    super(props);
    document.body.scrollTop = 0;
  }


  render() {
    

    return (
      <div className='navbar'>
         <div className='navbar-left'>
          <li className='navbar-link'><Link to="/dashboard"><h1 className='dash-logo'>KUNKKA</h1></Link></li>
          <li className='navbar-link'>
            <Link to='/dashboard'>
              <ul><Dropdown navItem={'Dashboard'} menu={DashboardMenu}/></ul>
            </Link>
          </li>
        <ul className='navbar-right'>
          <li className='navbar-link'>User Settings
            <ul id='user-dropdown' className='dropdown'>
              <li className='dropdown-link'><button onClick={this.props.logout}>Logout</button></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    );
  }

}


const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.session.currentUser
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DashboardNav));
