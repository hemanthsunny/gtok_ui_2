import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { getId } from 'firebase_config'
import { capitalizeFirstLetter } from 'helpers'
import { gtokFavicon } from 'images'
import { createRelationships } from 'lib/api'
import { SetRelationships } from 'store/actions'

const PendingUserComponent = ({
  currentUser, displayUserId, allUsers, bindRelationships
}) => {
  const [isFollowerLoading, setIsFollowerLoading] = useState(false)
  const [displayUser, setDisplayUser] = useState('')

  useEffect(() => {
    async function getUser () {
      let user = allUsers.find(u => u.id === displayUserId)
      if (!user) {
        user = await getId('users', displayUserId)
      }
      setDisplayUser(user)
    }
    getUser()
  }, [displayUserId, allUsers])

  const relationStatus = async (status) => {
    setIsFollowerLoading(true)
    if (displayUser.id) {
      await createRelationships(currentUser, displayUser, status)
    }
    await bindRelationships(currentUser)
    setIsFollowerLoading(false)
  }

  return (
    <div className='col-xs-12 my-xs-2 my-md-3'>
      <div className='card p-2 card-br-0'>
        <div className='media profile_card_img'>
          <Link to={'/app/profile/' + displayUser.id}>
            <img className='mr-2' src={displayUser.photoURL || gtokFavicon} alt='Card img cap' />
          </Link>
          <div className='media-body'>
            <h6 className='mt-0 text-camelcase'>
              <Link to={'/app/profile/' + displayUser.id}>
                {(displayUser.displayName && capitalizeFirstLetter(displayUser.displayName)) || 'No name'}
               </Link>
            </h6>
            <div>
              <div className='btn-group'>
                <button className='btn btn-sm btn-secondary' onClick={e => relationStatus('accept_request')}>
                  {isFollowerLoading ? <i className='fa fa-spinner fa-spin'></i> : 'Accept Request'}
                </button>
                <button type='button' className='btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split pt-0 pb-0' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                  <span className='sr-only'>Toggle Dropdown</span>
                </button>
                <div className='dropdown-menu'>
                  <button className='dropdown-item' onClick={e => relationStatus('decline_request')}>
                    <i className='fa fa-times'></i> Decline request
                  </button>
                </div>
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
  return { allUsers }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindRelationships: (content, type) => dispatch(SetRelationships(content, type))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PendingUserComponent)
