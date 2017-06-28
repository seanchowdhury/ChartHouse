import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { createChart } from '../../actions/charts_actions';
import merge from 'lodash/merge';
import { clearErrors } from '../../actions/error_actions';
import DashboardNav from '../dashboard/dashboard_header';


class ChartCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: "",
      minutes: "",
      seconds: "",
      course_id: "",
      title: "",
      boat: "",
      description: "",
    }
    this.saveChart = this.saveChart.bind(this);
  }

  update(field) {
    return (e) => {
      this.setState({
        [field]: e.currentTarget.value
      });
    }
  }

  saveChart() {
    const start_time = new Date(`${this.state.date} ${this.state.time}`);
    const course = this.props.courses[this.state.course_id]
    const decodedPath = google.maps.geometry.encoding.decodePath(course.waypoints)
    const lat = decodedPath[0].lat()
    const lng = decodedPath[0].lng()
    const start = start_time.toISOString().slice(0,10).replace(/-/g,"");
    const chart = merge({}, this.state, {boat_id: 1, start_time})
    this.props.createChart(chart)
      .then( ({chart}) => {
  
        this.props.history.push(`/charts/${Object.keys(chart)[0]}`)
        }
      );
  }

  render() {
    const courseArray = $.map(this.props.courses, function(value, index) { return [value]; });
    const courseList = courseArray.map((course) => {
      return (
        <option key={course.id} value={course.id}>{course.title}</option>
      );
    });
    const boatArray = $.map(this.props.boats, function(value, index) {return [value]; });
    const boatList = boatArray.map((boat) => {
      return (
        <option key={boat.id} value={boat.id}>Storm Queen</option>
      )
    })
    let disabledBoat;
    if (boatList.length === 0) {
      disabledBoat = <option disabled value='null'>-- no boats --</option>;
    }
    const timeSelect = [];
    for(let i = 0; i < 24; i++){
      for(let n = 0; n < 2; n++ ) {
        let hr;
        let min;
        let AMPM;
        if (i === 0) {
          hr = 12;
        } else if ( i > 12) {
          hr = i - 12;
        } else {
          hr = i
        }

        if (n === 0) {
          min = '00';
        } else {
          min = '30';
        }
        if (i > 11) {
          AMPM = 'PM';
        } else {
          AMPM = 'AM';
        }
        timeSelect.push(
          <option key={`${i}:${n*30}`} value={`${i}:${min}`}>{hr}:{min} {AMPM}</option>
        )
      }
    }
    return (
      <div>
        <DashboardNav />
        <div id='chart-form-container'>
          <div className='chart-create-entry-options'>
            <Link to='/newchart/'>Device</Link>
            <Link to='/newchart/'>File</Link>
            <Link id='selected-entry-option' to='/newchart/'>Manual</Link>
            <Link to='/newchart/'>Mobile</Link>
          </div>
          <form id='chart-form'>
            <h1>Manual Entry</h1>
            <div id='create-stats-input'>
              <label>Course <br/>
                <select value={this.state.course_id} onChange={this.update('course_id')}>
                  <option disabled value='null'> -- choose a course -- </option>
                  {courseList}
                </select>
              </label>
              <label>Duration<br />
                <div className='chart-duration'>
                  <div className='chart-duration-inputs'>
                    <input type='number' onChange={this.update('hours')} value={this.state.hours} />
                    <abbr>hr</abbr>
                  </div>
                  <div className='chart-duration-inputs'>
                    <input type='number' onChange={this.update('minutes')} value={this.state.minutes} />
                    <abbr>min</abbr>
                  </div>
                  <div className='chart-duration-inputs'>
                    <input type='number' onChange={this.update('seconds')} value={this.state.seconds} />
                    <abbr>sec</abbr>
                  </div>
                </div>
              </label>
            </div>
            <div id='create-logistics-input'>
              <label>Actual Departure Date & Time<br />
                  <input value={this.state.date} max={Date()} type="date" onChange={this.update('date')} id='chart-date'/>
                  <select value={this.state.time} onChange={this.update('time')}>
                    {timeSelect}
                  </select>
              </label>
              <label>Title<br />
                  <input id='chart-title-input' onChange={this.update('title')} value={this.state.title} placeholder='A little jaunt'/>
              </label>
            </div>
            <div id='create-details-input'>
              <label id='chart-create-boats'>Boats<br />
                <select value={this.state.boat} onChange={this.update('boat')}>
                   {disabledBoat}
                  {boatList}
                </select>
              </label>
              <label className='create-chart-description'>Description<br />
                <textarea onChange={this.update('description')} value={this.state.description} placeholder='How did it go? Was the water choppy? Did Joe do something stupid?'/>
              </label>
            </div>
            <ul className='save-chart-buttons'>
              <li><button onClick={() => this.saveChart()} className='save-chart'>Create</button></li>
              <li><Link to='/dashboard'>Cancel</Link></li>
            </ul>
          </form>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    errors: state.errors,
    courses: state.courses,
    boats: state.boats
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createChart: (chart) => dispatch(createChart(chart)),
    clearErrors: () => dispatch(clearErrors())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChartCreate));
