import { SET_SURVEYS_LIST, SET_SURVEYS_AFTER_RESPONSES } from "../types";

const INITIAL_STATE = {
	surveysList: [],
	surveysAfterResponses: []
}

const surveysList = (state=INITIAL_STATE, action) => {
	const { payload } = action;
	switch (action.type) {
		case SET_SURVEYS_LIST: {
			return {
				...state,
				surveysList: payload.surveys
			}
		}
		case SET_SURVEYS_AFTER_RESPONSES: {
			return {
				...state,
				surveysAfterResponses: payload.surveysAfterResponses
			}
		}
		default:
			return state;
	}
}

export default surveysList;