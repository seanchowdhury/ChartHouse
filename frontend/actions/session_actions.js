import * as ApiUtil from '../util/session_api_util';

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const RECEIVE_ERRORS = 'RECEIVE_ERRORS';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

export const receiveCurrentUser = (currentUser) => {
  return {
  type: RECEIVE_CURRENT_USER,
  currentUser: currentUser
};};

export const receiveErrors = (errors) => ({
  type: RECEIVE_ERRORS,
  errors
});

export const clearErrors = () => ({
  type: CLEAR_ERRORS
});

export const signup = user => dispatch => {
  return ApiUtil.signup(user)
    .then(user => (
      dispatch(receiveCurrentUser(user))
  ), err => {
    return dispatch(receiveErrors(err.responseJSON));
  });
};

export const login = user => dispatch => (
  ApiUtil.login(user).then(user => {
    return dispatch(receiveCurrentUser(user));
  }, err => (
    dispatch(receiveErrors(err.responseJSON))
  ))
);

export const logout = () => dispatch => (
  ApiUtil.logout().then( () => (
    dispatch(receiveCurrentUser(null))
  ))
);
