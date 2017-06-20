import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';

class DashboardNav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>AHOY</h1>
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
