import React, {Component} from "react";
import ReactApexChart from "react-apexcharts"
import PropTypes from "prop-types";
import uuid from "uuid";

import {connect} from "react-redux";


class Graph extends Component {

	constructor(props) {
		super(props);

		const id = uuid();
		const brushUuid = uuid();

		this.state = {
			chartOptionsArea: {
				chart: {
					id: id,
					toolbar: {
						autoSelect: "pan",
						show: false
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
					type: "datetime"
				}
			},
			chartOptionsBrush: {
				chart: {
					id: brushUuid,
					brush: {
						target: id,
						enabled: true
					},
					selection: {
						enabled: true,
					},
				},
				colors: ["#008FFB"],
				fill: {
					type: "gradient",
					gradient: {
						opacityFrom: 0.91,
						opacityTo: 0.1,
					}
				},
				xaxis: {
					type: "datetime",
					tooltip: {
						enabled: false
					}
				},
				yaxis: {
					// show: true,
					tickAmount: 2
				}
			},
		}
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return this.props.updateId !== nextProps.updateId;
	}

	render() {
		return (
			<div id="charts">
				<div id="chart1">
					<ReactApexChart options={this.state.chartOptionsArea} series={this.props.breathData} type="line" height="230"/>
				</div>
				<div id="chart2">
					<ReactApexChart options={this.state.chartOptionsBrush} series={this.props.breathData} type="area" height="130"/>
				</div>
			</div>
		);
	}
}

Graph.propTypes = {
	id: PropTypes.string.isRequired,
	updateId: PropTypes.string,
	breathData: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
	const user = state.user.users.find(user => user._id === ownProps.id);

	if (user) {
		let breath = user.breath.map((breath) => {
			return [parseInt(breath.time), breath.value];
		});

		if (breath.length === 0) {
			breath = [[new Date().getTime(), 0]];
		}

		return {breathData: [{name: "test", data: breath}]};
	} else {
		return {}
	}
};

export default connect(mapStateToProps, {})(Graph);
