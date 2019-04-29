// Requests to backend here
import {ADD_USER, DELETE_USER, ADD_BREATH_VALUE} from "./types";

export const addUser = user => dispatch => {
	dispatch({
		type: ADD_USER,
		payload: user
	})
};

export const addBreathValue = (id, breaths) => dispatch => {
	breaths.forEach(breath => {
		dispatch({
			type: ADD_BREATH_VALUE,
			payload: {
				id: id,
				breath: breath
			}
		})
	});
};

export const deleteUser = id => dispatch => {
	dispatch({
		type: DELETE_USER,
		payload: id
	})
};