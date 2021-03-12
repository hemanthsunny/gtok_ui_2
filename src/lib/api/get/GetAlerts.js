import { getQuery, firestore } from 'firebase_config'

export const getAlerts = async (currentUser, type) => {
  let alerts = []
  if (type === 'followersAlerts') {
    alerts = await getQuery(
      firestore.collection('logs').where('receiverId', '==', currentUser.id).where('collection', '==', 'users').where('actionKey', '==', 'followers').get()
    )
  } else {
    alerts = await getQuery(
      firestore.collection('logs').where('receiverId', '==', currentUser.id).get()
    )
  }
  alerts = alerts.sort((a, b) => b.timestamp - a.timestamp)
  return alerts
}
