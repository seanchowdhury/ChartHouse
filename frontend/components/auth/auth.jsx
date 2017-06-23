import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { signup, login } from '../../actions/session_actions';
import { clearErrors } from '../../actions/error_actions';
import values from 'lodash/values';

class Auth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      fname: '',
      lname: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  isLogin(){
    return this.props.formType === 'login'
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.formType != this.props.formType) {
      this.props.clearErrors();
    }
  }

  update(field) {
    return e => this.setState({
      [field]: e.currentTarget.value
    });
  }

  headerLink() {
    if (this.isLogin()) {
      return <Link className='header-link' to="/signup">Sign Up</Link>;
    } else {
      return <Link className='header-link' to="/login">Log In</Link>;
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const user = this.state;
    this.props.processForm({user});
  }

  renderFields() {
    if (this.isLogin()) {
      return (
        <div className='form-items'>
          <h2 className='login-title'>Log in</h2>
          <p className='enticing-text'>Log in with email</p>
          <input type="text"
            value={this.state.email}
            onChange={this.update('email')}
            className="login-input"
            placeholder="Your Email"/>
          <p className='error'> {this.props.errors.email}</p>
          <input type="password"
              value={this.state.password}
              onChange={this.update('password')}
              className="login-input"
              placeholder="Password"/>
            <p className='error'> {this.props.errors.password}</p>
            <p className='error'> {this.props.errors.base}</p>
            <button className="auth-button" type="submit" value="Log in">Log in</button>
        </div>
      )
    } else {
      return (
        <div className='form-items'>
          <p className='enticing-text'>Sign up with your email address</p>
          <input type="text"
            value={this.state.fname}
            onChange={this.update('fname')}
            className="login-input"
            placeholder="First Name"/>
          <p className='error'> {this.props.errors.fname}</p>
          <input type="text"
            value={this.state.lname}
            onChange={this.update('lname')}
            className="login-input"
            placeholder="Last Name"/>
          <p className='error'> {this.props.errors.lname}</p>
          <input type="text"
            value={this.state.email}
            onChange={this.update('email')}
            className="login-input"
            placeholder="Your Email"/>
          <p className='error'> {this.props.errors.email}</p>
          <input type="password"
            value={this.state.password}
            onChange={this.update('password')}
            className="login-input"
            placeholder="Password"/>
          <p className='error'> {this.props.errors.password}</p>
          <button className="auth-button" type="submit" value="Sign up">Sign up</button>
        </div>
      )
    }
  }

  render() {
    return (
      <div className='auth-items'>
        <section className='auth-header'>
          <div className='logo'>LOGO</div>
          {this.headerLink()}
        </section>
        <section className="login-form">
          <form onSubmit={this.handleSubmit}>
            {this.renderFields()}
          </form>
        </section>
      </div>
    )
  }

}


const mapStateToProps = (state) => {
  return {
  errors: state.errors
}};

const mapDispatchToProps = (dispatch, { location }) => {
  const formType = location.pathname.slice(1);
  const processForm = (formType === 'login') ? login : signup;
  return {
    clearErrors: () => dispatch(clearErrors()),
    processForm: user => dispatch(processForm(user)),
    formType
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Auth));
