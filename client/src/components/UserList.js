import React, {Component} from "react";
import {Container, ListGroup, ListGroupItem} from "reactstrap";
import {CSSTransition, TransitionGroup} from "react-transition-group";

// Redux actions and types
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {deleteUser} from "../actions/userActions";

// Pusher for life updates
import UserListItem from "./UserListItem";


class UserList extends Component {
	onDeleteClick = id => {
		if (window.confirm("Are you sure you want to delete the user? All its data will be removed! This cannot be undone.")) {
			this.props.deleteUser(id);
		}
	};

	render() {
		const users = this.props.users;

		return (
			<Container>
				<ListGroup>
					<TransitionGroup className="user-list">
						{users.map((user) => {
							const {_id, name, breath} = user;

							return (<CSSTransition key={_id} timeout={500} classNames="fade">
									<ListGroupItem>
										<UserListItem id={_id}
													  onDelete={() => this.onDeleteClick.bind(this, _id)}>
											{name}
										</UserListItem>
									</ListGroupItem>
								</CSSTransition>
							);
						})}
					</TransitionGroup>
				</ListGroup>
			</Container>
		);
	}
}

UserList.propTypes = {
	deleteUser: PropTypes.func.isRequired,
	users: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
	users: state.user.users
});


export default connect(mapStateToProps, {deleteUser})(UserList);