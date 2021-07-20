import React, { useState, useEffect } from 'react'

import { MobileFooterComponent } from 'components'
// import HeaderComponent from './header'
import UserDetailComponent from './children/user_detail/component'
import PostsComponent from './children/posts/component'
import ActivitiesComponent from './children/activities/component'
import './style.css'

import { getId, getQuery, firestore } from 'firebase_config'

function ParentComponent ({ currentUser, computedMatch }) {
  const [activeTab, setActiveTab] = useState('posts')
  const userId = computedMatch.params.user_id || ''
  const [displayUser, setDisplayUser] = useState('')
  const [relationship, setRelationship] = useState('')

  useEffect(() => {
    async function getDisplayUser () {
      let u = await getId('users', userId)
      u = Object.assign(u, { id: userId })
      setDisplayUser(u)
      console.log('u', u)
    }

    async function getRelationship () {
      const rlns = await getQuery(
        firestore.collection('userRelationships').where('userIdOne', '==', currentUser.id).where('userIdTwo', '==', userId).get()
      )
      if (rlns[0]) setRelationship(rlns[0])
      console.log('rln', rlns[0])
    }

    if (userId) {
      /* get relationship status */
      getRelationship()
      /* get user private status */
      getDisplayUser()
    }
  }, [userId])

  return (
    <div style={{ background: 'rgba(0,0,0,0.01)' }}>
      {/* <HeaderComponent userId={userId} currentUserId={currentUser.id} currentUser={currentUser} /> */}
      <div className='profile-page-wrapper'>
        <div className='dashboard-content pt-sm-0'>
          <UserDetailComponent currentUser={currentUser} />
          {
            userId
              ? relationship.status !== 1 && displayUser.private
                ? <div className='private-profile-text'>
                  @{displayUser.username} feelings are private. <br/> Follow to view what they are sharing.
                </div>
                : <PostsComponent currentUser={currentUser} setActiveTab={setActiveTab} />
              : <PostsComponent currentUser={currentUser} setActiveTab={setActiveTab} />
          }
          {activeTab === 'acstivities' && <ActivitiesComponent currentUser={currentUser} setActiveTab={setActiveTab} />}
        </div>
      </div>
      <MobileFooterComponent currentUser={currentUser} />
    </div>
  )
}

export default ParentComponent
