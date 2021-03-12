import { SET_CONVOS } from '../types'

const INITIAL_STATE = {
  conversations: []
}

const conversations = (state = INITIAL_STATE, action) => {
  const { payload } = action
  switch (action.type) {
    case SET_CONVOS: {
      return {
        ...state,
        conversations: payload.convos
      }
    }
    default:
      return state
  }
}

export default conversations
