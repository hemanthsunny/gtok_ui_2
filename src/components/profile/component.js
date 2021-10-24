import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { MobileFooterComponent } from 'components'
// import HeaderComponent from './header'
import UserDetailComponent from './steps/user_detail/component'
import PostsComponent from './steps/posts/component'
import './style.css'

import { getQuery, firestore } from 'firebase_config'

function ParentComponent ({ currentUser, computedMatch }) {
  const username = computedMatch.params.username ? computedMatch.params.username.replace('@', '') : ''
  const [displayUser, setDisplayUser] = useState('')
  const [relationship, setRelationship] = useState('')
  const history = useHistory()

  useEffect(() => {
    async function getDisplayUser () {
      const u = await getQuery(
        firestore.collection('users').where('username', '==', username).get()
      )
      if (u && u[0]) {
        setDisplayUser(u[0])
        /* get relationship status */
        getRelationship(u[0])
      }
    }

    async function getRelationship (u) {
      const rlns = await getQuery(
        firestore.collection('userRelationships').where('userIdOne', '==', currentUser.id).where('userIdTwo', '==', u.id).get()
      )
      if (rlns[0]) setRelationship(rlns[0])
    }

    if (username) {
      /* get user private status */
      getDisplayUser()
    }
  }, [username])

  return (
    <div style={{ background: 'rgba(0,0,0,0.01)' }}>
      {/* <HeaderComponent userId={userId} currentUserId={currentUser.id} currentUser={currentUser} /> */}
      <div className='profile-page-wrapper'>
        <div className='dashboard-content pt-sm-0'>
          {
            username && !displayUser
              ? <div className='text-center pt-5'>
                No user found <br />
                <small className='text-violet pointer' onClick={e => history.goBack()}>Go back</small>
              </div>
              : <div>
                <UserDetailComponent currentUser={currentUser} displayUser={displayUser} />
                {
                  username
                    ? relationship.status !== 1 && displayUser.private
                      ? <div className='private-profile-text'>
                        @{displayUser.username} assets are private. <br/> Follow to view what they are sharing.
                      </div>
                      : <PostsComponent currentUser={currentUser} displayUser={displayUser} hideHeader={true} />
                    : <PostsComponent currentUser={currentUser} displayUser={displayUser} hideHeader={true} />
                }
              </div>
          }
        </div>
      </div>
      <MobileFooterComponent currentUser={currentUser} />
    </div>
  )
}

export default ParentComponent
