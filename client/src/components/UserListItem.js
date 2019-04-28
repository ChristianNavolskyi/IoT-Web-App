import React, {Component} from "react";
import {Button, Collapse} from "reactstrap";
import PropTypes from "prop-types";
import Graph from "./Graph";
import LiveGraph from "./LiveGraph";
import uuid from "uuid";

const showBreath = "Show Live Breath";
const hideBreath = "Hide Live Breath";
const showFullBreath = "Show All Breath";
const hideFullBreath = "Hide All Breath";

class UserListItem extends Component {
	state = {
		isLiveDataOpen: false,
		isFullDataOpen: false,
		liveButtonText: showBreath,
		fullButtonText: showFullBreath,
		graphUpdateId: uuid(),
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
		const time = new Date().getTime();
		let cnt = 0;
		const userData = [{
			data: [...this.props.user.breath.map((breath) => {
				cnt = cnt + 100;
				return [time + cnt, breath.value]
			})]
		}];

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
					<Graph data={userData} updateId={this.state.graphUpdateId}/>
					<Button
						block
						color="dark"
						onClick={() => this.setState({graphUpdateId: uuid()})}>
						Refresh
					</Button>
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