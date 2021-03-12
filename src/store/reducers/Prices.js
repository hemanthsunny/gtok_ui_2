import { SET_PRICES } from '../types'

const INITIAL_STATE = {
  prices: []
}

const permissions = (state = INITIAL_STATE, action) => {
  const { payload } = action
  switch (action.type) {
    case SET_PRICES: {
      return {
        ...state,
        prices: payload.prices
      }
    }
    default:
      return state
  }
}

export default permissions
