// UI
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import React, {Component} from 'react';
import {Container} from "reactstrap";

import AppNavbar from "./components/AppNavbar";
import UserList from "./components/UserList";
import UserModal from "./components/UserModal";

// Redux for local state
import {connect} from "react-redux";
import {getUsers} from "./actions/userActions";
import {addUser, deleteUser, addBreathValue} from "./actions/updateActions";
import PropTypes from "prop-types";

// Pusher for life updates
import Pusher from "pusher-js";

Pusher.logToConsole = false;
const pusher = new Pusher('bd94a2a2564938087657', {
	cluster: 'eu',
	forceTLS: true
});


class App extends Component {
	componentDidMount() {
		this.props.getUsers();

		const userChannel = pusher.subscribe("user-channel");
		userChannel.bind("user-added", user => {
			this.props.addUser(user);
		});
		userChannel.bind("breath-value-added", ({id, breath}) => {
			this.props.addBreathValue(id, breath);
		});
		userChannel.bind("user-deleted", id => {
			this.props.deleteUser(id);
		});
	}

	render() {
		return (
			<div className="App">
				<AppNavbar/>
				<Container>
					<UserModal/>
					<UserList/>
				</Container>
			</div>
		);
	}
}

App.propTypes = {
	getUsers: PropTypes.func.isRequired,
	addUser: PropTypes.func.isRequired,
	deleteUser: PropTypes.func.isRequired,
	addBreathValue: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {getUsers, addUser, deleteUser, addBreathValue})(App);
