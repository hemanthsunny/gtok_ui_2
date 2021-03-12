import { getQuery, firestore } from 'firebase_config'

export const getNewMessagesCount = async (currentUser) => {
  let messagesCount = 0
  const convos = await getQuery(
    firestore.collection('conversations').where('users', 'array-contains-any', [currentUser.id]).get()
  )
  for (const convo of convos) {
    const currentUserRef = convo.usersRef.find(ref => ref.id === currentUser.id)
    if (currentUserRef.unread) {
      messagesCount += 1
    }
  }
  // .onSnapshot(snapshot => {
  //   snapshot.docChanges().forEach(change => {
  //     let convo = change.doc.data();
  //     let currentUserRef = convo.usersRef.find(ref => ref.id === currentUser.id);
  //     if (currentUserRef.unread) {
  //       messagesCount += 1;
  //       console.log("coming here", messagesCount);
  //     }
  //   })
  //   console.log("set", messagesCount)
  //   // return messagesCount;
  // });
  return messagesCount
}
