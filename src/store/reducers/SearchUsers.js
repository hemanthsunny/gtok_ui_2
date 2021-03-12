import {
  SET_SEARCH_USERS,
  SET_ALL_USERS,
  SET_ADMIN_USERS,
  SET_SINGLE_USER
} from '../types'

const INITIAL_STATE = {
  allUsers: [],
  adminUsers: [],
  singleUser: {}
}

const searchUsers = (state = INITIAL_STATE, action) => {
  const { payload } = action
  switch (action.type) {
    case SET_SEARCH_USERS: {
      return {
        ...state,
        users: payload.users
      }
    }
    case SET_ALL_USERS: {
      return {
        ...state,
        allUsers: payload.allUsers
      }
    }
    case SET_ADMIN_USERS: {
      return {
        ...state,
        adminUsers: payload.adminUsers
      }
    }
    case SET_SINGLE_USER: {
      return {
        ...state,
        singleUser: payload.singleUser
      }
    }
    default:
      return state
  }
}

export default searchUsers
