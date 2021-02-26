import {
	SET_CHATBOT_MESSAGES
} from "../types";

const INITIAL_STATE = {
	messages: [{
  	text: "Hello! I am Gtok bot"  	
  }, {
  	text: "Say hi"
  }]
}

const ChatBotMessages = (state=INITIAL_STATE, action) => {
	const { payload } = action;
	switch (action.type) {
		case SET_CHATBOT_MESSAGES: {
			return {
				...state,
				messages: payload.messages
			};
		}
		default:
			return state;
	}
}

export default ChatBotMessages;