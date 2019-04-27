import React, {Component} from "react";
import ReactApexChart from "react-apexcharts"
import PropTypes from "prop-types";

import {connect} from "react-redux";

class Graph extends Component {

	constructor(props) {
		super(props);

		this.state = {
			chartOptionsArea: {
				chart: {
					id: 'chartArea',
					toolbar: {
						show: false,
					},
				},
				colors: ['#F46E7A'],
				stroke: {
					width: 3,
					curve: "smooth"
				},
				dataLabels: {
					enabled: false
				},
				fill: {
					opacity: 1,
				},
				markers: {
					size: 0
				},
				xaxis: {
					type: 'datetime'
				}
			},
			chartOptionsBrush: {
				chart: {
					id: 'chartBrush',
					brush: {
						target: 'chartArea',
						enabled: true
					},
					selection: {
						enabled: true,
					},
				},
				colors: ['#008FFB'],
				fill: {
					type: 'gradient',
					gradient: {
						opacityFrom: 0.91,
						opacityTo: 0.1,
					}
				},
				xaxis: {
					type: 'datetime',
					tooltip: {
						enabled: false
					}
				},
				yaxis: {
					show: true,
					tickAmount: 2
				}
			},
		}
	}

	render() {
		const series = [{
			name: "Breath Values",
			data: this.props.breath
		}];

		return (
			<div id="charts">
				<div id="chart1">
					<ReactApexChart options={this.state.chartOptionsArea} series={series} type="line" height="230"/>
				</div>
				<div id="chart2">
					<ReactApexChart options={this.state.chartOptionsBrush} series={series} type="area" height="130"/>
				</div>
			</div>
		);
	}
}

Graph.propTypes = {
	id: PropTypes.string.isRequired,
};


const mapStateToProps = (state, ownProps) => {
	const breath = state.user.users.find(user => user._id === ownProps.id).breath.map((breath) => {
		return [breath.time, breath.value];
	});

	console.log(breath);
	return {breath: breath};
};

export default connect(mapStateToProps, {})(Graph);
