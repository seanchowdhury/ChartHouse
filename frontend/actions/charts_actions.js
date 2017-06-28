import * as ApiUtil from '../util/charts_api_util';
import { receiveErrors } from './error_actions';

export const RECEIVE_CHARTS = 'RECEIVE_CHARTS';
export const RECEIVE_CHART = 'RECEIVE_CHART';

export const receiveCharts = charts => ({
  type: RECEIVE_CHARTS,
  charts
});

export const receiveChart = chart => ({
  type: RECEIVE_CHART,
  chart
});

export const createChart = (chart) => dispatch => {
  return ApiUtil.createChart(chart)
    .then(chart => (
      dispatch(receiveChart(chart))),
          err => {
      return dispatch(receiveErrors(err.responseJSON));
  });
};

export const requestCharts = () => dispatch => {
  return ApiUtil.requestCharts()
    .then(charts => (
      dispatch(receiveCharts(charts))
    ));
};

export const requestChart = () => dispatch => {
  return ApiUtil.requestChart()
    .then(chart => (
      dispatch(receiveChart(chart))
    ));
};
