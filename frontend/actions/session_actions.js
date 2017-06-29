import * as ApiUtil from '../util/session_api_util';
import { receiveErrors } from './error_actions';

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';

export const receiveCurrentUser = ({user, courses, charts}) => {
  return {
  type: RECEIVE_CURRENT_USER,
  currentUser: user,
  courses,
  charts
}};

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
    dispatch(receiveCurrentUser({user:null, courses: {}}))
  ))
);
