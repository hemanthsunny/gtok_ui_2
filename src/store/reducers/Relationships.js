import { SET_RELATIONSHIPS, SET_USER_RELATIONS } from '../types'

const INITIAL_STATE = {
  relations: [],
  singleUserRelations: []
}

const relationships = (state = INITIAL_STATE, action) => {
  const { payload } = action
  switch (action.type) {
    case SET_RELATIONSHIPS: {
      const rls = payload.rls.filter(rln => rln.userIdTwo === payload.currentUser.id && rln.status === 0)
      return {
        ...state,
        relations: payload.rls,
        pendingRelationsCount: rls.length
      }
    }
    case SET_USER_RELATIONS: {
      return {
        ...state,
        singleUserRelations: payload.rls
      }
    }
    default:
      return state
  }
}

export default relationships
