import {
  SET_CURRENT_AUDIO
} from '../types'

export const SetCurrentAudio = (content) => {
  return {
    type: SET_CURRENT_AUDIO,
    payload: {
      currentAudio: content
    }
  }
}
