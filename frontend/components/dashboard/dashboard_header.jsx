import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';

class DashboardNav extends React.Component {
  constructor(props) {
    super(props);
  }

  showDash() {
    document.getElementById('dash-dropdown').style.display = 'block';
  }

  hideDash() {
    document.getElementById('dash-dropdown').style.display = 'none';
  }

  showUser() {
    document.getElementById('user-dropdown').style.display = 'block';
  }

  hideUser() {
    document.getElementById('user-dropdown').style.display = 'none';
  }


  render() {
    return (
      <div className='navbar'>
         <ul className='navbar-left'>
          <li className='navbar-link'><Link to="/dashboard"><h1 className='dash-logo'>KUNKKA</h1></Link></li>
          <li className='navbar-link' onMouseOver={this.showDash} onMouseLeave={this.hideDash}>Dashboard
            <ul id='dash-dropdown' className='dropdown'>
              <li className='dropdown-link'><Link to='/courses'>Courses</Link></li>
              <li className='dropdown-link'></li>
            </ul>
          </li>
        </ul>

        <ul className='navbar-right'>
          <li className='navbar-link' onMouseOver={this.showUser} onMouseLeave={this.hideUser}>User Settings
            <ul id='user-dropdown' className='dropdown'>
              <li className='dropdown-link'><button onClick={this.props.logout}>Logout</button></li>
            </ul>
          </li>
        </ul>
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
