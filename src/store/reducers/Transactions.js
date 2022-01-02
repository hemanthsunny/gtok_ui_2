import { SET_TRANSACTIONS } from "../types";

const INITIAL_STATE = {
  transactions: [],
};

const relationships = (state = INITIAL_STATE, action) => {
  const { payload } = action;
  switch (action.type) {
    case SET_TRANSACTIONS: {
      return {
        ...state,
        transactions: payload.po,
      };
    }
    default:
      return state;
  }
};

export default relationships;
