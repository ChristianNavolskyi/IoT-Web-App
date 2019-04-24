import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import React from 'react';
import {Provider} from "react-redux";
import {Container} from "reactstrap";

import store from "./store";
import AppNavbar from "./components/AppNavbar";
import UserList from "./components/UserList";
import UserModal from "./components/UserModal";


function App() {
	return (
		<Provider store={store}>
			<div className="App">
				<AppNavbar/>
				<Container>
					<UserModal/>
					<UserList/>
				</Container>
			</div>
		</Provider>
	);
}

export default App;
