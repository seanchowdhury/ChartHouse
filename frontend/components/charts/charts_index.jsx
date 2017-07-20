import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import values from 'lodash/values';
import DashboardNav from '../dashboard/dashboard_header';
import { requestCharts, deleteChart } from '../../actions/charts_actions';
import { timeConverter } from '../../util/misc_util';
import Footer from '../footer/footer';

class ChartsIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: ""
    }
  }

  componentWillMount() {
    const locations = Object.keys(this.props.charts).map((key, index) => {
      const currentChart = this.props.charts[key];
      const decodedPath = google.maps.geometry.encoding.decodePath(this.props.courses[currentChart.course_id].waypoints)
      const startLatLng = {lat: decodedPath[0].lat(), lng: decodedPath[0].lng()};
      const geocoder = new google.maps.Geocoder
      const location = geocoder.geocode({'location': startLatLng}, (results, status) => {
        if (status === 'OK') {
          return results[1].formatted_address;
        }
      });
    })
    this.setState({locations});
  }

  handleDelete(chart) {
    this.props.deleteChart(chart);
  }

  render() {
    const tableContents = Object.keys(this.props.charts).map((key, index) => {
      const currentChart = this.props.charts[key];
      const dateTime = new Date(currentChart.start_time)
      const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
      const day = days[dateTime.getDay()];
      const date = `${day}, ${dateTime.getMonth()}/${dateTime.getDate()}/${dateTime.getFullYear()}`

      return (
        <tr key={index}>
          <td className='table-row'>{date}</td>
          <td className='table-row'><Link to={`/charts/${key}`}>{currentChart.title}</Link></td>
          <td className='table-row'>{currentChart.duration.toString().toHHMMSS()}</td>
          <td className='table-row'>{this.props.courses[currentChart.course_id].distance.toFixed(1)} mi</td>
          <td className='table-row'>{this.state.locations[index]}</td>
          <td className='table-row'><button onClick={() => {this.handleDelete(currentChart)}}>Delete</button></td>
        </tr>
      )
    }, this
  );
  let numCharts = Object.keys(this.props.charts).length;
  if (numCharts != 1) {
    numCharts = `${numCharts} Charts`
  } else {
    numCharts = `1 Chart`
  }
    return (
      <div>
        <DashboardNav />
        <div id='chart-index-container'>
          <h1>
            My Charts
          </h1>
          <div id='chart-index-search'>
            <strong>Keywords</strong> <br />
            <input placeholder="Much like this text this search bar is a placeholder"></input>
            <button>Search</button>
          </div>
          <h2>{numCharts}</h2>
            <table id='chart-table'>
              <tbody>
              <tr>
                <th className='table-row'>Date</th>
                <th className='table-row'>Title</th>
                <th className='table-row'>Duration</th>
                <th className='table-row'>Distance</th>
                <th className='table-row'>Location</th>
                <th></th>
              </tr>
                {tableContents}
              </tbody>
            </table>
        </div>
        <Footer />
      </div>
    )
  }
}


const mapStateToProps = ({charts, courses}) => {
  return {
    charts,
    courses
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestCharts: () => dispatch(requestCharts()),
    deleteChart: (chart) => dispatch(deleteChart(chart))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChartsIndex));
