import { SET_USER, SET_DB_USER, SET_LOGGED_IN, SET_RELOAD } from "../types";

const INITIAL_STATE = {
  reload: false,
  loggedIn: false,
  user: null,
  dbUser: null,
};

const authUsers = (state = INITIAL_STATE, action) => {
  const { payload } = action;
  switch (action.type) {
    case SET_DB_USER: {
      return {
        ...state,
        dbUser: payload.dbUser,
      };
    }
    case SET_USER: {
      return {
        ...state,
        user: payload.user,
      };
    }
    case SET_LOGGED_IN: {
      return {
        ...state,
        loggedIn: payload.loggedIn,
      };
    }
    case SET_RELOAD: {
      return {
        ...state,
        reload: payload.reload,
      };
    }
    default:
      return state;
  }
};

export default authUsers;
