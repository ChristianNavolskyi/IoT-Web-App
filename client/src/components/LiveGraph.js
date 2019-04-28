import React, {Component} from "react";
import ReactApexChart from "react-apexcharts"
import {Button} from "reactstrap";
import ApexChart from "apexcharts";
import PropTypes from "prop-types";

import uuid from "uuid";

import {connect} from "react-redux";

class LiveGraph extends Component {

	data = [[new Date().getTime(), 0]];

	constructor(props) {
		super(props);

		const id = uuid();

		this.state = {
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
					range: 5000
				}
			},
			series: [{
				data: [[new Date().getTime(), 0]]
			}],
			intervalHandle: 0,
			isAdding: false
		}
	}

	addData = () => {
		if (!this.state.isAdding) {
			const range = this.state.liveChartOptions.xaxis.range;
			const uuid = this.state.uuid;

			const handle = setInterval(() => {
				let data = this.data;
				const lastY = data[data.length - 1][1];

				if (new Date().getTime() - data[0][0] > 2 * range) {
					data = data.slice(data.length / 2, data.length)
				}

				this.data = [...data, [new Date().getTime(), lastY + Math.random() * 20 - 10]];

				ApexChart.exec(uuid, "updateSeries", [{
					name: "Breath Value",
					data: this.data
				}]);
			}, 100);

			this.setState({
				intervalHandle: handle
			})
		} else {
			clearInterval(this.state.intervalHandle)
		}

		this.setState({
			isAdding: !this.state.isAdding
		})
	};

	render() {
		return (
			<div id="charts">
				<div id="chart1">
					<ReactApexChart options={this.state.liveChartOptions} series={this.state.series} type="line" height="230"/>
				</div>
				<Button onClick={this.addData.bind(this)}>Add Data</Button>
			</div>
		);
	}
}

LiveGraph.propTypes = {
	id: PropTypes.string.isRequired,
};


const mapStateToProps = (state, ownProps) => {
	const user = state.user.users.find(user => user._id === ownProps.id);
	if (user) {
		const breath = user.breath.map((breath) => {
			return [breath.time, breath.value];
		});

		return {breath: breath};
	}
};

export default connect(mapStateToProps, {})(LiveGraph);
