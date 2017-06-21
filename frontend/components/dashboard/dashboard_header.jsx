import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';

class DashboardNav extends React.Component {
  constructor(props) {
    super(props);
  }

  showDash() {
    document.getElementById('dropdown').style.display = 'block';
  }

  hideDash() {
    document.getElementById('dropdown').style.display = 'none';
  }

  render() {
    return (
      <div className='navbar'>
        <Link to="/dashboard"><h1 className='logo'>AHOY</h1></Link>
        <ul className='nav-links group'>
          <li className='navbar-link' onMouseOver={this.showDash} onMouseLeave={this.hideDash}>Dashboard
            <ul id='dropdown'>
              <li><Link to='/myroutes'>Routes</Link></li>
            </ul>
          </li>
        </ul>
        <button className='navbar-link' onClick={this.props.logout}>Log Out</button>
      </div>
    );
  }

}


const mapStateToProps = (state) => {
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
