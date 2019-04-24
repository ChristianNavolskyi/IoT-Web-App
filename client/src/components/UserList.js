import React, {Component} from "react";
import {Container, ListGroup, ListGroupItem, Button} from "reactstrap";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import PropTypes from "prop-types";

import {connect} from "react-redux";
import {getUsers, deleteUser} from "../actions/userActions";


class UserList extends Component {
	componentDidMount() {
		this.props.getUsers();
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
						{users.map(({_id, name}) => (
							<CSSTransition key={_id} timeout={500} classNames="fade">
								<ListGroupItem>
									<Button
										className="remove-btn"
										color="danger"
										size="sm"
										onClick={this.onDeleteClick.bind(this, _id)}>
										&times;
									</Button>
									{name}
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
	user: state.user,
});


export default connect(mapStateToProps, {getUsers, deleteUser})(UserList);