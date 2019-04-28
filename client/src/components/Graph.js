import React, {Component} from "react";
import ReactApexChart from "react-apexcharts"
import PropTypes from "prop-types";


class Graph extends Component {

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
					range: 20
				}
			},
			chartOptionsBrush: {
				chart: {
					id: "chartBrush",
					brush: {
						target: "chartArea",
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
					tooltip: {
						enabled: false
					}
				},
				yaxis: {
					show: true,
					tickAmount: 2
				}
			},
			series: [{
				name: "Breath Value",
				data: [[]]
			}]
		}
	}

	componentDidMount() {
		console.log(this.props.data);

		this.setState({
			series: [{
				name: "Breath Value",
				data: this.props.data
			}]
		})
	}

	render() {
		return (
			<div id="charts">
				<div id="chart1">
					<ReactApexChart options={this.state.chartOptionsArea} series={this.state.series} type="line" height="230"/>
				</div>
				<div id="chart2">
					<ReactApexChart options={this.state.chartOptionsBrush} series={this.state.series} type="area" height="130"/>
				</div>
			</div>
		);
	}
}

Graph.propTypes = {
	data: PropTypes.array.isRequired,
};

export default Graph;
