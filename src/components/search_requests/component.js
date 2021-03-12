import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import HeaderComponent from './header'

import { SidebarComponent, PendingUserComponent } from 'components'
import { SetAllUsers } from 'store/actions'

const ParentComponent = ({
  currentUser, allUsers, bindAllUsers, relations, newAlertsCount, newMessagesCount
}) => {
  const [searchVal, setSearchVal] = useState('')
  const [pendingRelations, setPendingRelations] = useState([])

  useEffect(() => {
    if (!allUsers[0] && !searchVal) {
      if (currentUser.admin) bindAllUsers(currentUser, 'adminUsers')
      else bindAllUsers(currentUser, 'all')
    }
    if (relations[0]) {
      const rlns = relations.filter(rln => rln.userIdTwo === currentUser.id && rln.status === 0)
      setPendingRelations(rlns)
    }
  }, [currentUser, allUsers, bindAllUsers, searchVal, relations])

  const searchValue = async (val) => {
    if (val.includes('search')) {
      val = val.replace('search', '').trim().toLowerCase()
    }
    if (val) {
      val = val.trim().toLowerCase()
    }
    if (val.includes('clear search') ||
      val.includes('clear all') ||
      val.includes('show all') ||
      val.includes('show me all')
    ) {
      val = ''
    }
    await bindAllUsers(currentUser, 'search', val)
    setSearchVal(val)
    if (!!val && !allUsers[0]) {
      // readoutLoud('No search results found');
    }
  }

  const subHeader = () => (
    <div className='dashboard-tabs search-subheader' role='navigation' aria-label='Main'>
      <div className='tabs -big'>
        <Link to='/app/search' className='tab-item'>Find a new search</Link>
        <Link to='/app/search/followers' className='tab-item'>Your followers</Link>
        <Link to='/app/search/requests' className='tab-item -active'>Pending requests</Link>
        <Link to='/app/search/following' className='tab-item'>You following</Link>
      </div>
    </div>
  )

  return (
    <div>
      <HeaderComponent newAlertsCount={newAlertsCount} newMessagesCount={newMessagesCount} />
      <div>
        <SidebarComponent currentUser={currentUser} />
        <div className='dashboard-content'>
          {subHeader()}
          <div className='container'>
            <div className='d-flex'>
              <div className='input-group my-3'>
                <input type='text' className='form-control br-0' aria-label='Search' placeholder='Search on names...' onChange={e => searchValue(e.target.value)}/>
              </div>
            </div>
            <small>{pendingRelations.length} users</small>
            <div className='tab-content' id='pills-tabContent'>
              <div className='tab-pane fade' id='pills-requests' role='tabpanel' aria-labelledby='pills-requests-tab'>
                {
                  pendingRelations[0]
                    ? pendingRelations.map((rln, idx) =>
                    <PendingUserComponent displayUserId={rln.userIdOne} currentUser={currentUser} status={rln.status} key={idx} />
                    )
                    : <div className='card text-center mt-2 p-2 text-secondary'>No pending requests</div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { allUsers } = state.users
  const { relations } = state.relationships
  const { newAlertsCount } = state.alerts
  const { newMessagesCount } = state.chatMessages
  return { allUsers, relations, newAlertsCount, newMessagesCount }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindAllUsers: (content, type, searchVal) => dispatch(SetAllUsers(content, type, searchVal))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParentComponent)
