import { SET_CURRENT_AUDIO } from "../types";

const INITIAL_STATE = {
  currentAudio: null,
};

const AudioPlayer = (state = INITIAL_STATE, action) => {
  const { payload } = action;
  switch (action.type) {
    case SET_CURRENT_AUDIO: {
      return {
        ...state,
        currentAudio: payload.currentAudio,
      };
    }
    default:
      return state;
  }
};

export default AudioPlayer;
