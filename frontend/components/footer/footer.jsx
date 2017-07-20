import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='footer-main'>
        <div className='footer-left'>
          <h1 className='footer-logo'>KUNKKA</h1>
          <p className='aesthetic-text'>2 0 1 7 A E S T H E T I C T E X T</p>
        </div>

        <div>
          <ul className='footer-right'>
            <li className='footer-li'>
              <h2>About Kunkka</h2>
              <ul>
                <li><a href='https://github.com/seanchowdhury/kunkka'>Repo</a></li>
              </ul>
            </li>
            <li className='footer-li'>
              <h2>Links</h2>
              <ul>
                <li><a href='https://seanchowdhury.github.io'>Portfolio</a></li>
                <li><a href='https://github.com/seanchowdhury'>GitHub</a></li>
                <li><a href='https://linkedin.com/in/sean-chowdhury/'>Linkedin</a></li>
              </ul>
            </li>
            <li className='footer-li'>
              <h2>Credits</h2>
              <ul>
                <li>Design: <a href='https://strava.com'>Strava</a></li>
                <li>Shoutouts: <a href='https://github.com/aAclee'>Calvin</a></li>
                <li>Shoutouts: <a href='https://github.com/yosephha'>Yoseph</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Footer;
