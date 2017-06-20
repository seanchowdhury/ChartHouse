import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { signup, login } from '../../actions/session_actions';

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
    if (nextProps.loggedIn) {
      this.props.history.push('/dashboard');
    }
  }

  update(field) {
    return e => this.setState({
      [field]: e.currentTarget.value
    });
  }

  headerLink() {
    if (this.isLogin()) {
      return <Link to="/signup">Sign Up</Link>;
    } else {
      return <Link to="/login">Log In</Link>;
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = this.state;
    this.props.processForm({user});
  }

  renderErrors() {
    return(
      <ul>
        {this.props.errors.map((error, i) => (
          <li key={`error-${i}`}>
            {error}
          </li>
        ))}
      </ul>
    );
  }

  renderFields() {
    if (this.isLogin()) {
      return (
        <div className='form-items'>
          <p>Log in</p>
          <p>Log in with email</p>
          <input type="text"
            value={this.state.email}
            onChange={this.update('email')}
            className="login-input"
            placeholder="Your Email"/>
          <input type="password"
              value={this.state.password}
              onChange={this.update('password')}
              className="login-input"
              placeholder="Password"/>
            <button className="auth-button" type="submit" value="Log in">Log in</button>
        </div>
      )
    } else {
      return (
        <div className='form-items'>
          <p>Sign up with your email address</p>
          <input type="text"
            value={this.state.fname}
            onChange={this.update('fname')}
            className="login-input"
            placeholder="First Name"/>
          <input type="text"
            value={this.state.lname}
            onChange={this.update('lname')}
            className="login-input"
            placeholder="Last Name"/>
          <input type="text"
            value={this.state.email}
            onChange={this.update('email')}
            className="login-input"
            placeholder="Your Email"/>
          <input type="password"
              value={this.state.password}
              onChange={this.update('password')}
              className="login-input"
              placeholder="Password"/>
            <button className="auth-button" type="submit" value="Sign up">Sign up</button>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <section className='auth-header'>
          <h2>AHOY</h2> {this.headerLink()}
        </section>
        <section>
          <div className="login-form">
            <form onSubmit={this.handleSubmit}>
              {this.renderErrors()}
              {this.renderFields()}
            </form>
          </div>
        </section>
      </div>
    )
  }

}






const mapStateToProps = ({session}) => ({
  errors: session.errors
});

const mapDispatchToProps = (dispatch, { location }) => {
  const formType = location.pathname.slice(1);
  const processForm = (formType === 'login') ? login : signup;
  return {
    processForm: user => dispatch(processForm(user)),
    formType
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Auth));
