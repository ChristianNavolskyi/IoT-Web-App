import React, {Component} from "react";
import ReactApexChart from "react-apexcharts"
import PropTypes from "prop-types";
import ApexChart from "apexcharts";
import moment from "moment";

import uuid from "uuid";

import {connect} from "react-redux";

class LiveGraph extends Component {

	data = [];

	constructor(props) {
		super(props);

		const id = uuid();

		this.state = {
			limit: 500,
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
					width: 3
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
					range: 30000,
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
		if ("lastBreath" in this.props) {
			this.data = [...this.data, this.props.lastBreath];

			ApexChart.exec(this.state.uuid, "updateSeries", [{
				name: "Breath Value",
				data: this.data
			}]);
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const dataLength = this.data.length;

		if (dataLength > this.state.limit) {
			this.data = this.data.slice(dataLength / 2, dataLength)
		}

		this.data = [...this.data, this.props.lastBreath];

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
	lastBreath: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
	const lastBreath = state.user.lastBreath.find(breath => breath.id === ownProps.id && "breathData" in breath);

	if (lastBreath) {
		const lastBreathData = lastBreath.breathData;

		return {lastBreath: [parseInt(lastBreathData.time), lastBreathData.value]};
	} else {
		return {}
	}
};

export default connect(mapStateToProps, {})(LiveGraph);
