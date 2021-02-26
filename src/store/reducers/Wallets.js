import { SET_WALLET } from "../types";

const INITIAL_STATE = {
	wallet: []
}

const permissions = (state=INITIAL_STATE, action) => {
	const { payload } = action;
	switch (action.type) {
		case SET_WALLET: {
			return {
				...state,
				wallet: payload.wallet
			}
		}
		default:
			return state;
	}
}

export default permissions;
