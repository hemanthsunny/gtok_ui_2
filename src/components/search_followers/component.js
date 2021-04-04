import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'

import HeaderComponent from './header'
import UserComponent from './user/component'
import { SidebarComponent } from 'components'
import { SetAllUsers } from 'store/actions'

const ParentComponent = ({
  currentUser, allUsers, bindAllUsers, relations, pendingRelationsCount, newAlertsCount, newMessagesCount
}) => {
  const [followerRelations, setFollowerRelations] = useState([])
  const [followers, setFollowers] = useState([])

  useEffect(() => {
    if (!allUsers[0]) {
      bindAllUsers(currentUser, 'all')
    }
    if (relations[0]) {
      const rlns = relations.filter(rln => rln.userIdTwo === currentUser.id && rln.status === 1)
      setFollowerRelations(rlns)
      const uIds = _.map(rlns, 'userIdOne')
      setFollowers(_.filter(allUsers, (u) => _.indexOf(uIds, u.id) !== -1))
    }
  }, [currentUser, allUsers, bindAllUsers, relations])

  const subHeader = () => (
    <div className='dashboard-tabs search-subheader' role='navigation' aria-label='Main'>
      <div className='tabs -big'>
        <Link to='/app/search' className='tab-item'>Find a new search</Link>
        <Link to='/app/search/followers' className='tab-item -active'>Your followers</Link>
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
      <div>
        <SidebarComponent currentUser={currentUser} />
        <div className='dashboard-content'>
          {subHeader()}
          <div className='container mt-3'>
            {followerRelations.length && <small>{followerRelations.length} followers</small>}
            {
              followers[0]
                ? <div className='row'> {
                followers.map((f, idx) =>
                <UserComponent displayUser={f} currentUser={currentUser} key={idx} />
                )}
                </div>
                : <div className='text-center mt-5'>
                  There are currently no followers. Here you can <Link to='/app/search' className='text-violet'> look for your friends.</Link>
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { allUsers } = state.users
  const { relations, pendingRelationsCount } = state.relationships
  const { newAlertsCount } = state.alerts
  const { newMessagesCount } = state.chatMessages
  return { allUsers, relations, pendingRelationsCount, newAlertsCount, newMessagesCount }
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
