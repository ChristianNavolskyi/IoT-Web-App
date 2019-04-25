import React, {Component} from "react";
import {Container, ListGroup, ListGroupItem, Button} from "reactstrap";
import {CSSTransition, TransitionGroup} from "react-transition-group";

// Redux actions and types
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getUsers, deleteUser} from "../actions/userActions";

// Pusher for life updates
import Pusher from "pusher-js";

Pusher.logToConsole = true;
const pusher = new Pusher('bd94a2a2564938087657', {
	cluster: 'eu',
	forceTLS: true
});


class UserList extends Component {
	componentDidMount() {
		this.props.getUsers();

		const userChannel = pusher.subscribe("user-channel");
		userChannel.bind("user-added", () => {
			this.props.getUsers();
		});
		userChannel.bind("breath-value-added", () => {
			this.props.getUsers();
		});
		userChannel.bind("user-deleted", () => {
			this.props.getUsers();
		});
	}

	onDeleteClick = id => {
		this.props.deleteUser(id);
	};

	render() {
		const {users} = this.props.user;

		return (
			<Container>
				<ListGroup>
					<TransitionGroup className="user-list">
						{users.map(({_id, name, breath}) => (
							<CSSTransition key={_id} timeout={500} classNames="fade">
								<ListGroupItem>
									<Button
										className="remove-btn"
										color="danger"
										size="sm"
										onClick={this.onDeleteClick.bind(this, _id)}>
										&times;
									</Button>
									{name} has {breath.length} breath entries
								</ListGroupItem>
							</CSSTransition>
						))}
					</TransitionGroup>
				</ListGroup>
			</Container>
		);
	}
}

UserList.propTypes = {
	getUsers: PropTypes.func.isRequired,
	deleteUser: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	user: state.user
});


export default connect(mapStateToProps, {getUsers, deleteUser})(UserList);