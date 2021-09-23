import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { CustomImageComponent } from 'components'
import { capitalizeFirstLetter } from 'helpers'
import { createRelationships } from 'lib/api'
import { SetRelationships } from 'store/actions'

const PendingUserComponent = ({
  currentUser, displayUser, allUsers, bindRelationships
}) => {
  const [isFollowerLoading, setIsFollowerLoading] = useState(false)
  const [status, setStatus] = useState('')

  const relationStatus = async (status) => {
    setIsFollowerLoading(true)
    setStatus(status)
    if (displayUser.id) {
      await createRelationships(currentUser, displayUser, status)
    }
    setTimeout(async () => {
      setIsFollowerLoading(false)
      setStatus('')
      await bindRelationships(currentUser)
    }, 3000)
  }

  return (
    <div className='search-user col-12 my-2 my-md-3'>
      <div className='p-0'>
        <div className='media profile-user'>
          <Link to={'/app/profile/' + displayUser.id}>
            <CustomImageComponent user={displayUser} />
          </Link>
          <div className='media-body media-middle pl-3'>
            <Link className='username' to={'/app/profile/' + displayUser.id}>
              @{displayUser.username}<br/>
              <span className='actual-name'>{(displayUser.displayName && capitalizeFirstLetter(displayUser.displayName)) || 'No name'}</span>
             </Link>
             <div className='pull-right'>
              {
                isFollowerLoading
                  ? <div className='request-result'>Request {status === 'accept_request' ? 'accepted' : 'cancelled'}</div>
                  : <div>
                      <img className='icon-request pointer' src={require('assets/svgs/RequestAccept.svg').default} alt="1" onClick={e => relationStatus('accept_request')} />
                      <img className='icon-request ml-3 pointer' src={require('assets/svgs/RequestDecline.svg').default} alt="1" onClick={e => relationStatus('decline_request')} />
                  </div>
              }
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
