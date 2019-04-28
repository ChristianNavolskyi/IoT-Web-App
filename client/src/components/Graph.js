import React, {Component} from "react";
import ReactApexChart from "react-apexcharts"
import PropTypes from "prop-types";
import uuid from "uuid";


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

	render() {
		return (
			<div id="charts">
				<div id="chart1">
					<ReactApexChart options={this.state.chartOptionsArea} series={this.props.data} type="line" height="230"/>
				</div>
				<div id="chart2">
					<ReactApexChart options={this.state.chartOptionsBrush} series={this.props.data} type="area" height="130"/>
				</div>
			</div>
		);
	}
}

Graph.propTypes = {
	data: PropTypes.array.isRequired,
};

export default Graph;
