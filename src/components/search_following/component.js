import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'

import HeaderComponent from './header'
import UserComponent from './user/component'
import { SetAllUsers } from 'store/actions'
import { MobileFooterComponent } from 'components'

const ParentComponent = ({
  currentUser, allUsers, bindAllUsers, relations, newAlertsCount, newMessagesCount, pendingRelationsCount
}) => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (!allUsers[0]) {
      bindAllUsers(currentUser, 'all')
    }
    if (relations[0]) {
      const rlns = relations.filter(rln => rln.userIdOne === currentUser.id && rln.status === 1)
      const uIds = _.map(rlns, 'userIdTwo')
      setUsers(_.filter(allUsers, (u) => _.indexOf(uIds, u.id) !== -1))
    }
  }, [currentUser, allUsers, bindAllUsers, relations])

  return (
    <div>
      <HeaderComponent newAlertsCount={newAlertsCount} newMessagesCount={newMessagesCount} />
      <div>
        <div className='dashboard-content'>
          <div className='container mt-5 pt-2 pt-md-5 px-4'>
            {
              users[0]
                ? <div className='row'> {
                users.map((u, idx) =>
                <UserComponent displayUser={u} currentUser={currentUser} key={idx} />
                )}
                </div>
                : <div className='text-center mt-5'>
                  You don't seem to be following anyone. Keep an eye out for <Link to='/app/search' className='text-violet'> your friends here.</Link>
                </div>
            }
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
)(ParentComponent)
