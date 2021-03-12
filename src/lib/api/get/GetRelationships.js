import { getQuery, firestore } from 'firebase_config'

export const getRelationships = async (currentUser = {}, displayUser = {}, status = null) => {
  let relations = []
  if (status !== null) {
    if (displayUser.id && currentUser.id) {
      relations = await getQuery(
        firestore.collection('userRelationships').where('userIdOne', '==', currentUser.id).where('userIdTwo', '==', displayUser.id).where('status', '==', status).get()
      )
    } else if (!displayUser.id) {
      relations = await getQuery(
        firestore.collection('userRelationships').where('userIdOne', '==', currentUser.id).where('status', '==', status).get())
    } else if (!currentUser.id) {
      relations = await getQuery(
        firestore.collection('userRelationships').where('userIdTwo', '==', displayUser.id).where('status', '==', status).get())
    }
  } else {
    if (displayUser.id && currentUser.id) {
      relations = await getQuery(
        firestore.collection('userRelationships').where('userIdOne', '==', currentUser.id).where('userIdTwo', '==', displayUser.id).get()
      )
    } else {
      relations = await getQuery(
        firestore.collection('userRelationships').where('userIdOne', '==', currentUser.id).get())
      const rlns = await getQuery(
        firestore.collection('userRelationships').where('userIdTwo', '==', currentUser.id).get())
      relations = [...relations, ...rlns]
    }
  }
  return relations
}
