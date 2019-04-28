import React, {Component} from "react";
import {Button, Collapse} from "reactstrap";
import PropTypes from "prop-types";
import Graph from "./Graph";
import LiveGraph from "./LiveGraph";

const showBreath = "Show Live Breath";
const hideBreath = "Hide Live Breath";
const showFullBreath = "Show All Breath";
const hideFullBreath = "Hide All Breath";

class UserListItem extends Component {
	state = {
		isLiveDataOpen: false,
		isFullDataOpen: false,
		liveButtonText: showBreath,
		fullButtonText: showFullBreath

	};

	toggleLiveData = () => {
		let buttonText = hideBreath;

		if (this.state.isLiveDataOpen) {
			buttonText = showBreath;
		}

		this.setState({
			isLiveDataOpen: !this.state.isLiveDataOpen,
			liveButtonText: buttonText
		});
	};

	toggleFullData = () => {
		let buttonText = hideFullBreath;

		if (this.state.isFullDataOpen) {
			buttonText = showFullBreath;
		}

		this.setState({
			isFullDataOpen: !this.state.isFullDataOpen,
			fullButtonText: buttonText
		});
	};

	render() {

		console.log(this.props);
		const userData = [...this.props.user.breath.map((breath) => {
			return [breath.time, breath.value]
		})];

		return (
			<div>
				{this.props.children}
				<Button
					color="dark"
					style={{marginLeft: "0.5rem"}}
					onClick={this.toggleLiveData}>
					{this.state.liveButtonText}
				</Button>
				<Button
					color="dark"
					style={{marginLeft: "0.5rem"}}
					onClick={this.toggleFullData}>
					{this.state.fullButtonText}
				</Button>
				<Button
					className="remove-btn, float-right"
					color="danger"
					onClick={this.props.onDelete()}
					style={{marginLeft: "0.5rem"}}>
					&times;
				</Button>
				<Collapse
					className="breath-modal"
					isOpen={this.state.isLiveDataOpen}
					style={{marginTop: "3rem", maxHeight: "60%"}}>
					<LiveGraph id={this.props.user._id}/>
				</Collapse>
				<Collapse
					className="breath-modal"
					isOpen={this.state.isFullDataOpen}
					style={{marginTop: "3rem", maxHeight: "60%"}}>
					<Graph data={userData}/>
				</Collapse>
			</div>
		);
	}
}

UserListItem
	.propTypes = {
	user: PropTypes.object.isRequired,
	onDelete: PropTypes.func.isRequired
};

export default UserListItem;