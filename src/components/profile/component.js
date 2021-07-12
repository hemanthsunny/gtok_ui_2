import React, { useState } from 'react'

import { MobileFooterComponent } from 'components'
// import HeaderComponent from './header'
import UserDetailComponent from './children/user_detail/component'
import PostsComponent from './children/posts/component'
import ActivitiesComponent from './children/activities/component'
import './style.css'

function ParentComponent ({ currentUser, computedMatch }) {
  const [activeTab, setActiveTab] = useState('posts')
  // const userId = computedMatch.params.user_id
  return (
    <div style={{ background: 'rgba(0,0,0,0.01)' }}>
      {/* <HeaderComponent userId={userId} currentUserId={currentUser.id} currentUser={currentUser} /> */}
      <div>
        <div className='dashboard-content pt-sm-0'>
          <UserDetailComponent currentUser={currentUser} />
          <PostsComponent currentUser={currentUser} setActiveTab={setActiveTab} />
          {activeTab === 'acstivities' && <ActivitiesComponent currentUser={currentUser} setActiveTab={setActiveTab} />}
        </div>
      </div>
      <MobileFooterComponent currentUser={currentUser} />
    </div>
  )
}

export default ParentComponent
