import React, {Component} from "react";
import {Button, Collapse, Popover, PopoverBody, PopoverHeader} from "reactstrap";
import PropTypes from "prop-types";
import Graph from "./Graph";
import LiveGraph from "./LiveGraph";
import uuid from "uuid";

import {connect} from "react-redux";
import {telegramTest} from "../actions/userActions";

const showBreath = "Show Live Breath";
const hideBreath = "Hide Live Breath";
const showFullBreath = "Show All Breath";
const hideFullBreath = "Hide All Breath";

const buttonId = "button";
let cnt = 0;

const getButtonId = () => {
	cnt = cnt + 1;
	return buttonId + cnt;
};

class UserListItem extends Component {
	state = {
		buttonUuid: getButtonId(),
		isLiveDataOpen: false,
		isFullDataOpen: false,
		popoverOpen: false,
		liveButtonText: showBreath,
		fullButtonText: showFullBreath,
		graphUpdateId: uuid(),
	};

	togglePopover = () => {
		this.setState({
			popoverOpen: !this.state.popoverOpen
		})
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
		return (
			<div>
				{this.props.children}
				<Button
					id={this.state.buttonUuid}
					color="dark"
					style={{marginLeft: "0.5rem"}}
					type="button">
					Show id
				</Button>
				<Popover placement="bottom" isOpen={this.state.popoverOpen} target={this.state.buttonUuid} toggle={this.togglePopover}>
					<PopoverHeader>User Id</PopoverHeader>
					<PopoverBody>
						You can set this id in you device to show up here.
						<br/>
						ID: {this.props.id}
					</PopoverBody>
				</Popover>
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
					color="dark"
					style={{marginLeft: "0.5rem"}}
					onClick={() => telegramTest(this.props.id)}>
					Send test notification
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
					<LiveGraph id={this.props.id}/>
				</Collapse>
				<Collapse
					className="breath-modal"
					isOpen={this.state.isFullDataOpen}
					style={{marginTop: "3rem", maxHeight: "60%"}}>
					<Graph id={this.props.id} updateId={this.state.graphUpdateId}/>
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

UserListItem.propTypes = {
	id: PropTypes.string.isRequired,
	onDelete: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {})(UserListItem);