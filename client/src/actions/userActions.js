// Requests to backend here
import {GET_USERS, ADD_USER, DELETE_USER} from "./types";

export const getUsers = () => {
	return {
		type: GET_USERS,
	}
};

export const deleteUser = id => {
	return {
		type: DELETE_USER,
		payload: id
	}
};

export const addUser = (user) => {
	return {
		type: ADD_USER,
		payload: user
	}
};