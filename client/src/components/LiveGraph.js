import React, {Component} from "react";
import ReactApexChart from "react-apexcharts"
import {Button} from "reactstrap";
import ApexChart from "apexcharts";
import PropTypes from "prop-types";

import {connect} from "react-redux";

let data = [[0, 0]];

class LiveGraph extends Component {

	constructor(props) {
		super(props);

		this.state = {
			chartOptionsArea: {
				chart: {
					id: "chartArea",
					toolbar: {
						autoSelect: "pan",
						show: false,
						tools: {
							selection: false,
							zoom: false,
							zoomin: false,
							zoomout: false,
							pan: false,
							reset: true
						},

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
					range: 30000
				}
			},
			series: [{
				name: "Breath Value",
				data: [[0, 0]]
			}],
			intervalHandle: 0,
			isAdding: false
		}
	}

	//
	// componentDidUpdate(prevProps, prevState, snapshot) {
	// 	const breathData = this.props.breath;
	// 	if (!breathData) {
	// 		return
	// 	}
	// 	const max = breathData[breathData.length - 1][0];
	// 	let min = breathData[0];
	//
	// 	if (breathData.length > 10) {
	// 		min = breathData[breathData.length - 10][0];
	// 	}
	//
	// 	ApexChart.exec("chartArea", "updateOptions", {
	// 		xaxis: {
	// 			...this.state.chartOptionsArea.xaxis,
	// 			min: min,
	// 			max: max
	// 		}
	// 	});
	//
	// 	ApexChart.exec("chartArea", "updateSeries", [{
	// 		name: "Breath Value",
	// 		data: this.props.breath
	// 	}]);
	//
	// 	console.log(min);
	// 	console.log(max);
	// }

	addData = () => {
		if (!this.state.isAdding) {
			const handle = setInterval(() => {
				const lastY = data[data.length - 1][1];
				console.log(data.length);
				if (data.length > 160) {
					data = data.slice(data.length - 150, data.length)
				}

				data = [...data, [new Date().getTime(), lastY + Math.random() * 20 - 10]];

				ApexChart.exec("chartArea", "updateSeries", [{
					name: "Breath Value",
					data: data
				}])
			}, 500);

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
					<ReactApexChart options={this.state.chartOptionsArea} series={this.state.series} type="line" height="230"/>
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
