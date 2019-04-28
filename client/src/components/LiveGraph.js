import React, {Component} from "react";
import ReactApexChart from "react-apexcharts"
import PropTypes from "prop-types";
import ApexChart from "apexcharts";
import moment from "moment";

import uuid from "uuid";

import {connect} from "react-redux";

class LiveGraph extends Component {

	data = [];
	series = [{data: this.data}];

	constructor(props) {
		super(props);

		const id = uuid();
		const range = 30000;

		this.state = {
			range: range,
			uuid: id,
			liveChartOptions: {
				chart: {
					id: id,
					toolbar: {
						autoSelect: "pan",
						show: false,
						tools: {
							zoom: false
						}
					},
				},
				colors: ["#F46E7A"],
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
					type: "datetime",
					range: range,
					tickPlacement: "between",
					labels: {
						formatter: function (value, timestamp, index) {
							return moment(new Date(timestamp)).format("hh:mm:ss")
						}
					}
				}
			},
			series: [{
				name: "Breath Value",
				data: this.data
			}],
			intervalHandle: 0,
			isAdding: false
		}
	}

	componentDidMount() {
		console.debug("Did Mount");
		this.data = [...this.data, this.props.lastBreath];
		this.series = [{data: this.data}];

		console.debug(this.data);

		ApexChart.exec(this.state.uuid, "updateSeries", [{
			name: "Breath Value",
			data: this.data
		}]);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		console.debug("Did Update");
		this.data = [...this.data, this.props.lastBreath];
		this.series = [{data: this.data}];
		console.debug(this.series);

		ApexChart.exec(this.state.uuid, "updateSeries", [{
			name: "Breath Value",
			data: this.data
		}]);
	}

	render() {
		return (
			<div id="charts">
				<div id="chart1">
					<ReactApexChart options={this.state.liveChartOptions} series={this.state.series} type="line" height="230"/>
				</div>
			</div>
		);
	}
}

LiveGraph.propTypes = {
	id: PropTypes.string.isRequired,
	lastBreath: PropTypes.array.isRequired
};

const mapStateToProps = (state, ownProps) => {
	const lastBreath = state.user.lastBreath.find(breath => breath.id === ownProps.id).breathData;

	return {lastBreath: [parseInt(lastBreath.time), lastBreath.value]}
};

export default connect(mapStateToProps, {})(LiveGraph);
