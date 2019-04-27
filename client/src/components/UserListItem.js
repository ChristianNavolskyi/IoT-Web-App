import React, {Component} from "react";
import {Button, Collapse} from "reactstrap";
import PropTypes from "prop-types";
import Graph from "./Graph";

const showBreath = "Show Breath";
const hideBreath = "Hide Breath";

class UserListItem extends Component {
	state = {
		isOpen: false,
		buttonText: showBreath
	};

	toggle = () => {
		let buttonText = hideBreath;

		if (this.state.isOpen) {
			buttonText = showBreath;
		}

		this.setState({
			isOpen: !this.state.isOpen,
			buttonText: buttonText
		});
	};

	render() {
		return (
			<div>
				<Button
					color="dark"
					style={{marginRight: "0.5rem"}}
					onClick={this.toggle}>
					{this.state.buttonText}
				</Button>
				{this.props.children}
				<Button
					className="remove-btn, float-right"
					color="danger"
					onClick={this.props.onDelete()}
					style={{marginLeft: "0.5rem"}}>
					&times;
				</Button>
				<Collapse
					className="breath-modal"
					isOpen={this.state.isOpen}
					style={{marginTop: "3rem", maxHeight: "60%"}}>
					<Graph id={this.props.id}/>
				</Collapse>
			</div>
		);
	}
}

UserListItem.propTypes = {
	id: PropTypes.object.isRequired,
	onDelete: PropTypes.func.isRequired
};

export default UserListItem;