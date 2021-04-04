import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'

import HeaderComponent from './header'
import UserComponent from './user/component'
import { SidebarComponent } from 'components'
import { SetAllUsers } from 'store/actions'

const ParentComponent = ({
  currentUser, allUsers, bindAllUsers, relations, pendingRelationsCount
}) => {
  const [pendingRelations, setPendingRelations] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    // if (!allUsers[0]) {
    bindAllUsers(currentUser, 'all')
    // }
    if (relations[0]) {
      // status must be 0
      const rlns = relations.filter(rln => rln.userIdTwo === currentUser.id && rln.status === 0)
      setPendingRelations(rlns)
      const uIds = _.map(rlns, 'userIdOne')
      setUsers(_.filter(allUsers, (u) => _.indexOf(uIds, u.id) !== -1))
    }
  }, [currentUser, allUsers, bindAllUsers, relations])

  const subHeader = () => (
    <div className='dashboard-tabs search-subheader' role='navigation' aria-label='Main'>
      <div className='tabs -big'>
        <Link to='/app/search' className='tab-item'>Find a new search</Link>
        <Link to='/app/search/followers' className='tab-item'>Your followers</Link>
        <Link to='/app/search/requests' className='tab-item -active'>
          Pending requests{(pendingRelationsCount > 0) && <sup><img src={require('assets/svgs/DotActive.svg').default} className={'dot-icon'} alt='Dot' /></sup>}
        </Link>
        <Link to='/app/search/following' className='tab-item'>You following</Link>
      </div>
    </div>
  )

  return (
    <div>
      <HeaderComponent />
      <div>
        <SidebarComponent currentUser={currentUser} />
        <div className='dashboard-content'>
          {subHeader()}
          <div className='container mt-3'>
            {pendingRelations.length > 0 && <small>{pendingRelations.length} requests</small>}
            {
              users[0]
                ? <div className='row'> {
                users.map((u, idx) =>
                <UserComponent displayUser={u} currentUser={currentUser} key={idx} />
                )}
                </div>
                : <div className='text-center mt-5'>
                  There are no pending requests.
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
  return { allUsers, relations, pendingRelationsCount }
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
