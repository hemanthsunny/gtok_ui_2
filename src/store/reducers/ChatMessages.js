import {
	SET_CHAT_MESSAGES,
	SET_NEW_MESSAGES_COUNT
} from "../types";

const INITIAL_STATE = {
	messages: [],
	newMessagesCount: 0
}

const ChatMessages = (state=INITIAL_STATE, action) => {
	const { payload } = action;
	switch (action.type) {
		case SET_CHAT_MESSAGES: {
			return {
				...state,
				messages: payload.messages
			};
		}
		case SET_NEW_MESSAGES_COUNT: {
			return {
				...state,
				newMessagesCount: payload.newMessagesCount
			}
		}
		default:
			return state;
	}
}

export default ChatMessages;