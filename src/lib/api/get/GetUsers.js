import { get, getQuery, firestore } from 'firebase_config'

export const getUsers = async (currentUser, type, searchVal) => {
  let users = []
  if (type === 'search' && !!searchVal) {
    users = await getQuery(
      firestore.collection('users').where('displayName', '>=', searchVal).where('displayName', '<=', searchVal + '~').get()
    )
  } else if (type === 'adminUsers') {
    users = await getQuery(
      firestore.collection('users').where('admin', '==', true).get()
    )
  } else if (type === 'followers') {
    // users = await getQuery(
    //   firestore.collection("users").where("id", "in", [currentUser.followers[0], currentUser.followers[1]]).get()
    // );
    users = await get('users')
    let followers = []
    followers = currentUser.followers.map(f => {
      if (users.find(u => u.id === f)) {
        return f
      }
      return null
    })
    users = followers.filter(u => u !== null)
  } else {
    users = await get('users')
  }
  users = users.filter(u => u.id !== currentUser.id).map(u => {
    u.isFollower = !!u.followers.find(id => id === currentUser.id)
    return u
  })
  users = users.sort((a, b) => b.createdAt - a.createdAt)
  return users
}
