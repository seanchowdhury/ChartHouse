import { RECEIVE_CURRENT_USER } from '../actions/session_actions';
import { RECEIVE_CHART, RECEIVE_CHARTS } from '../actions/charts_actions';
import merge from 'lodash/merge';

const ChartsReducer = (state = {}, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      if (action.charts) {
        return action.charts;
      } else {
        return {};
      }
    case RECEIVE_CHARTS:
      return action.charts;
    case RECEIVE_CHART:
      return merge({}, state, action.chart)
    default:
      return state;
  }
};

export default ChartsReducer;
