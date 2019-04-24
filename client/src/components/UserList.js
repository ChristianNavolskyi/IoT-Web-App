import React, {Component} from "react";
import {Container, ListGroup, ListGroupItem, Button} from "reactstrap";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import uuid from "uuid";

import {connect} from "react-redux";
import {getUsers} from "../actions/userActions";

import PropTypes from "prop-types";


class UserList extends Component {
	componentDidMount() {
		this.props.getUsers();
	}

	render() {
		const {users} = this.props.user;

		return (
			<Container>
				<Button
					color="dark"
					style={{marginBottom: "2rem"}}
					onClick={() => {
						const name = prompt("Enter username");
						if (name) {
							this.setState(state => ({
								users: [...state.users, {id: uuid(), name}]
							}));
						}
					}}>
					Add User
				</Button>

				<ListGroup>
					<TransitionGroup className="user-list">
						{users.map(({id, name}) => (
							<CSSTransition key={id} timeout={500} classNames="fade">
								<ListGroupItem>
									<Button
										className="remove-btn"
										color="danger"
										size="sm"
										onClick={() => {
											this.setState(state => ({
												users: state.users.filter(user => user.id !== id)
											}))
										}}>
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
	user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	user: state.user,
});


export default connect(mapStateToProps, {getUsers})(UserList);