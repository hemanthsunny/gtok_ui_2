import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'

import { add, update, getId, getQuery, firestore } from 'firebase_config'

const CreateChatLayerComponent = (props) => {
  const chatUserId = props.match.params.id
  const { currentUser } = props

  useEffect(() => {
    const getUser = async (id) => {
      const result = await getId('users', id)
      return result || {}
    }

    const startConvo = () => {
      if (!chatUserId) {
        alert('Something went wrong. Try again later')
        return
      }
      const usersInStrFormat = [currentUser.id, chatUserId].sort().toString()
      async function checkForConvo () {
        const convo = await getQuery(
          firestore.collection('conversations').where('usersInStrFormat', '==', usersInStrFormat).get()
        )
        return convo
      }
      async function checkForRelationship () {
        const rln = await getQuery(
          firestore.collection('userRelationships').where('userIdOne', '==', chatUserId).where('userIdTwo', '==', currentUser.id).get()
        )
        return rln[0] && rln[0].status === 1
      }

      async function getInitialConversation () {
        let convo = await checkForConvo()
        const userRelationship = await checkForRelationship()

        if (!convo[0]) {
          const resultUser = await getUser(chatUserId)
          const data = {
            admin: currentUser.id,
            usersInStrFormat: usersInStrFormat,
            users: [currentUser.id, chatUserId],
            groupName: null,
            photoURL: null,
            group: false,
            chatRequest: !userRelationship,
            usersRef: [
              {
                ref: 'users/' + currentUser.id,
                id: currentUser.id,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                lastSeen: new Date().getTime()
              },
              {
                ref: 'users/' + chatUserId,
                id: chatUserId,
                displayName: resultUser.displayName,
                photoURL: resultUser.photoURL,
                lastSeen: new Date().getTime()
              }
            ]
          }

          await add('conversations', data)
          convo = await checkForConvo()
        }
        await update('conversations', convo[0].id, {
          chatRequest: !userRelationship
        })
        props.history.push('/app/chats/' + convo[0].id)
      }
      getInitialConversation()
    }

    if (chatUserId) {
      startConvo()
    }
  })

  return (<div></div>)
}

export default withRouter(CreateChatLayerComponent)
