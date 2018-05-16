import React, { Component } from 'react';
import ReactH from 'react-highcharts';
import './App.css';

class Chart extends Component {

  render() {
    return <ReactH ref={hc => (this.chart = hc)} config={this.props.config}/>
  }
}

export default Chart
