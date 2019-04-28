import {GET_USERS, ADD_USER, DELETE_USER, USERS_LOADING, ADD_BREATH_VALUE} from "../actions/types";

const initialState = {
	users: [],
	loading: false,
	lastBreath: []
};

export default function (state = initialState, action) {
	let lastBreath;

	switch (action.type) {
		case GET_USERS:
			lastBreath = action.payload.map(user => {
				const breath = user.breath;
				if (breath.length > 0) {
					const lastBreathData = breath[breath.length - 1];
					return {id: user._id, breathData: lastBreathData};
				}
				return {id: user._id};
			});

			return {
				...state,
				users: action.payload,
				loading: false,
				lastBreath: lastBreath
			};
		case DELETE_USER:
			return {
				...state,
				users: state.users.filter(user => user._id !== action.payload)
			};
		case ADD_USER:
			return {
				...state,
				users: [action.payload, ...state.users]
			};
		case USERS_LOADING:
			return {
				...state,
				loading: true
			};
		case ADD_BREATH_VALUE:
			const alteredUsers = state.users.map(user => {
				if (user._id === action.payload.id) {
					const alteredUser = user;
					alteredUser.breath = [...user.breath, ...action.payload.breath];
					return alteredUser;
				}
				return user;
			});

			lastBreath = state.lastBreath.map(breath => {
				if (breath.id === action.payload.id) {
					return {...breath, breathData: action.payload.breath[0]};
				} else {
					return breath;
				}
			});

			return {
				...state,
				users: alteredUsers,
				lastBreath: lastBreath
			};
		default:
			return state;
	}
}