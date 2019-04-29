// Requests to backend here
import {GET_USERS, ADD_USER, DELETE_USER, USERS_LOADING} from "./types";
import axios from "axios";

export const telegramTest = (userId) => {
	const data = {userId: userId, message: "Telegram Test Message"};

	axios.post("api/telegram", data)
};

export const getUsers = () => dispatch => {
	dispatch(setUsersLoading());
	axios.get("/api/user")
		.then(res =>
			dispatch({
				type: GET_USERS,
				payload: res.data
			}))
};

export const addUser = user => dispatch => {
	axios.post("/api/user", user)
		.then(res =>
			dispatch({
				type: ADD_USER,
				payload: res.data
			}))
};

export const deleteUser = id => dispatch => {
	axios.delete(`/api/user/${id}`)
		.then(res =>
			dispatch({
				type: DELETE_USER,
				payload: id
			}))
};

export const setUsersLoading = () => {
	return {
		type: USERS_LOADING
	}
};