import { getQuery, firestore } from 'firebase_config'

export const getPermissions = async (currentUser) => {
  let permissions = await getQuery(
    firestore.collection('permissions').where('active', '==', true).get()
  )
  permissions = permissions.sort((a, b) => a.id - b.id)
  return permissions
}
