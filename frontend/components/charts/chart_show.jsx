import React from 'react';
import ReactDOM from 'react-dom';
import DashboardNav from '../dashboard/dashboard_header';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { requestChart } from '../../actions/charts_actions';
import { timeConverter } from '../../util/misc_util';

class ChartShow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <DashboardNav />
      </div>
    )
  }


}

const mapStateToProps = ({charts}, {match}) => {
  debugger
  const chartId = parseInt(match.params.chartId);
  const chart = charts[chartId];
  return {
    chart
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChartShow));
