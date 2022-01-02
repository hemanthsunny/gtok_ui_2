import { SET_SUBSCRIPTION_PLANS } from "../types";

const INITIAL_STATE = {
  plans: [],
};

const subscriptionPlans = (state = INITIAL_STATE, action) => {
  const { payload } = action;
  switch (action.type) {
    case SET_SUBSCRIPTION_PLANS: {
      return {
        ...state,
        plans: payload.plans,
      };
    }
    default:
      return state;
  }
};

export default subscriptionPlans;
