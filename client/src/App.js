import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import AppNavbar from "./components/AppNavbar";
import UserList from "./components/UserList";
import React from 'react';
import {Provider} from "react-redux";
import store from "./store";


function App() {
	return (
		<Provider store={store}>
			<div className="App">
				<AppNavbar/>
				<UserList/>
			</div>
		</Provider>
	);
}

export default App;
