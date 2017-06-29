import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';

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
           <Link to='/dashboard' className='dash-logo'>KUNKKA</Link>
            <div className="dropdown">
              <Link to='/dashboard' className="dropbtn">Dashboard</Link>
              <div className="dropdown-content">
                <Link to='/courses'>Courses</Link>
                <Link to='/charts'>Charts</Link>
              </div>
            </div>
          </div>
        <ul className='navbar-right'>
          <div className="dropdown">
            <img className="dropbtn" className='profile-pic-dash' src={window.images.profilePic}/>
            <div className="dropdown-content" id='dash-profile-content'>
              <button id='dash-logout' onClick={this.props.logout}>Logout</button>
            </div>
          </div>
          <div className="dropdown">
            <i className="dropbtn" id='dash-add' className="fa fa-plus-square-o" aria-hidden="true"></i>
            <div className="dropdown-content" id='dash-add-content'>
              <Link to='/newcourse'>Create Course</Link>
              <Link to='/newchart'>Create Chart</Link>
            </div>
          </div>
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
