import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import $ from 'jquery'
import _ from 'lodash'
import './style.css'

import { add, update, getId, getQuery, firestore } from 'firebase_config'
import { CustomImageComponent } from 'components'

const CreateChatComponent = (props) => {
  const [searchVal, setSearchVal] = useState('')
  const [userList, setUserList] = useState(0)
  const [allUsers, setAllUsers] = useState(0)
  // const chatUserId = props.match.params.id
  const { currentUser } = props

  useEffect(() => {
    async function getAllUsers () {
      const users = []
      await firestore.collection('users').get()
        .then((snapshot) => {
          snapshot.docs.map(doc => {
            users.push({
              id: doc.id,
              ...doc.data()
            })
            return doc
          })
        })
      setAllUsers(users)
      setUserList(users)
    }
    /* get all users on load */
    if (!allUsers) {
      getAllUsers()
    }
  })

  const getUser = async (id) => {
    const result = await getId('users', id)
    return result || {}
  }

  const startConvo = (chatUserId) => {
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
      $('#createChatModal').hide()
      $('.modal-backdrop').remove()
      props.history.push('/app/chats/' + convo[0].id)
    }
    getInitialConversation()
  }

  async function searchValue (val) {
    const users = _.filter(allUsers, _.conforms({
      username: (u) => u.includes(val)
    }))
    // const users = _.filter(userList, (u) => u.displayName && u.displayName.indexOf(val) > -1)
    setUserList(users)
    setSearchVal(val)
  }

  return (
    <div className='modal fade' id='createChatModal' tabIndex='-1' role='dialog' aria-labelledby='createChatModalLabel' aria-hidden='true'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-body pt-0'>
            <div className='accessibility-icon text-center'>
              <img className='btn-play' src={require('assets/svgs/Accessibility.svg').default} alt='1' />
            </div>
            <div className='d-flex'>
              <div className='input-group my-3'>
                <input type='text' className='form-control search-input' aria-label='Search' placeholder='Search on username' onChange={e => searchValue(e.target.value)} value={searchVal}/>
              </div>
            </div>
            <div className='user-list'>
              {
                userList[0]
                  ? userList.sort().map((user, idx) => user.id !== currentUser.id &&
                    <div className='media chat-user' key={idx}>
                      <Link to={'/app/profile/' + user.id}>
                        <CustomImageComponent user={user} size='sm'/>
                      </Link>
                      <div className='media-body pl-1'>
                        <div className='username pull-left'>
                          <small>@{user.username}</small>
                         </div>
                        <div className='pull-right'>
                          <button className='btn btn-link' onClick={e => startConvo(user.id)}>
                            <img className='btn-send' src={require('assets/svgs/ArrowUp.svg').default} alt='1' />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                  : <div className='text-center py-3'>
                    No users found
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRouter(CreateChatComponent)
