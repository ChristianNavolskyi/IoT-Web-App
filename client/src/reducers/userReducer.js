import {GET_USERS, ADD_USER, DELETE_USER, USERS_LOADING, ADD_BREATH_VALUE} from "../actions/types";

const initialState = {
	users: [],
	loading: false
};

export default function (state = initialState, action) {
	switch (action.type) {
		case GET_USERS:
			return {
				...state,
				users: action.payload,
				loading: false
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

			return {
				...state,
				users: alteredUsers
			};
		default:
			return state;
	}
}