import { SET_NEW_ALERTS_COUNT, SET_ALERTS } from '../types'

const INITIAL_STATE = {
  newAlertsCount: [],
  alerts: []
}

const Alerts = (state = INITIAL_STATE, action) => {
  const { payload } = action
  switch (action.type) {
    case SET_NEW_ALERTS_COUNT: {
      return {
        ...state,
        newAlertsCount: payload.newAlertsCount
      }
    }
    case SET_ALERTS: {
      return {
        ...state,
        alerts: payload.alerts
      }
    }
    default:
      return state
  }
}

export default Alerts
