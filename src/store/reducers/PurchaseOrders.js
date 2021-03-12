import { SET_PURCHASE_ORDERS } from '../types'

const INITIAL_STATE = {
  purchaseOrders: []
}

const relationships = (state = INITIAL_STATE, action) => {
  const { payload } = action
  switch (action.type) {
    case SET_PURCHASE_ORDERS: {
      return {
        ...state,
        purchaseOrders: payload.po
      }
    }
    default:
      return state
  }
}

export default relationships
