import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import './style.css'

import HeaderComponent from './header'
import SearchUserComponent from './user/component'
import { MobileFooterComponent } from 'components'
import { SetAllUsers } from 'store/actions'
import { getQuery, firestore } from 'firebase_config'

const SearchComponent = ({
  currentUser, allUsers, bindAllUsers, relations, newAlertsCount, newMessagesCount, pendingRelationsCount
}) => {
  const [searchVal, setSearchVal] = useState('')
  const [users, setUsers] = useState(allUsers)
  const [priorityUsers, setPriorityUsers] = useState('')

  useEffect(() => {
    if (!allUsers[0]) {
      if (currentUser.admin) bindAllUsers(currentUser, 'all')
      else bindAllUsers(currentUser, 'all')
    }

    async function getPriorityUsers () {
      const pusers = await getQuery(
        firestore.collection('users').where('priority', '==', 'high').get()
      )
      setPriorityUsers(pusers)
    }

    if (!priorityUsers) {
      getPriorityUsers()
    }
  }, [currentUser, allUsers, bindAllUsers, relations])

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
    // search from allUsers
    const users = _.filter(allUsers, (u) => u.displayName && u.displayName.toLowerCase().indexOf(val) > -1)
    setUsers(users)
    setSearchVal(val)
    if (!!val && !allUsers[0]) {
      // readoutLoud('No search results found');
    }
  }

  const subHeader = () => (
    <div className='dashboard-tabs search-subheader d-none' role='navigation' aria-label='Main'>
      <div className='tabs -big'>
        <Link to='/app/search' className='tab-item -active'>Find a new search</Link>
        <Link to='/app/search/followers' className='tab-item'>Your followers</Link>
        <Link to='/app/search/requests' className='tab-item'>
          Pending requests{(pendingRelationsCount > 0) && <sup><img src={require('assets/svgs/DotActive.svg').default} className={'dot-icon'} alt='Dot' /></sup>}
        </Link>
        <Link to='/app/search/following' className='tab-item'>You following</Link>
      </div>
    </div>
  )

  return (
    <div>
      <HeaderComponent newAlertsCount={newAlertsCount} newMessagesCount={newMessagesCount} />
      <div className='pt-4'>
        <div className='dashboard-content'>
          {subHeader()}
          <div className='container'>
            <div className='d-flex'>
              <div className='input-group my-3'>
                <input type='text' className='form-control search-input' aria-label='Search' placeholder='Search on names...' onChange={e => searchValue(e.target.value)}/>
              </div>
            </div>
            <div>
              <div>
              {/* If searchVal exists and users found */}
              {
                searchVal && users[0] && <div className='search-user'>
                  {
                    users.map((user, idx) =>
                      <SearchUserComponent displayUser={user} currentUser={currentUser} key={idx} />
                    )
                  }
                  </div>
              }
              {/* If searchVal exists and no users found */}
              {
                searchVal && !users[0] && <div className='text-center mt-5'>
                  There are no users with this name.
                </div>
              }
              {/* If there is no searchVal */}
              {
                !searchVal && <div className='text-center mt-5 d-none'>
                  <img src={require('assets/svgs/Search.svg').default} className='profile-icon' alt='Search' />
                  <div>
                    Look for a new user here.
                  </div>
                </div>
              }
              </div>
              {
                !searchVal &&
                <div className='priority-user-list'>
                  <div className='priority-user-list-header'>Priority users</div>
                  {
                    priorityUsers[0] && priorityUsers.map((user, idx) => <div className={`priority-user ${user.id === currentUser.id && 'd-none'}`} key={idx}>
                        <SearchUserComponent displayUser={user} currentUser={currentUser} key={idx} />
                      </div>
                    )
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      <MobileFooterComponent currentUser={currentUser} />
    </div>
  )
}

const mapStateToProps = (state) => {
  const { allUsers } = state.users
  const { relations, pendingRelationsCount } = state.relationships
  const { newAlertsCount } = state.alerts
  const { newMessagesCount } = state.chatMessages
  return { allUsers, relations, newAlertsCount, newMessagesCount, pendingRelationsCount }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindAllUsers: (content, type, searchVal) => dispatch(SetAllUsers(content, type, searchVal))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchComponent)
