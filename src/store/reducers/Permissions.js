import { SET_PERMISSIONS } from "../types";

const INITIAL_STATE = {
  pms: [],
};

const permissions = (state = INITIAL_STATE, action) => {
  const { payload } = action;
  switch (action.type) {
    case SET_PERMISSIONS: {
      return {
        ...state,
        pms: payload.pms,
      };
    }
    default:
      return state;
  }
};

export default permissions;
