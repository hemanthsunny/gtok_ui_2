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

  const relationStatus = async (status) => {
    setIsFollowerLoading(true)
    if (displayUser.id) {
      await createRelationships(currentUser, displayUser, status)
    }
    await bindRelationships(currentUser)
    setIsFollowerLoading(false)
  }

  return (
    <div className='col-xs-12 col-sm-6 col-lg-4 my-2 my-md-3'>
      <div className='card p-3 card-br-0'>
        <div className='media profile_card_img'>
          <Link to={'/app/profile/' + displayUser.id}>
            <CustomImageComponent user={displayUser} size='lg' />
          </Link>
          <div className='media-body pl-3 pt-1'>
            <h6 className='mt-0 text-camelcase'>
              <Link to={'/app/profile/' + displayUser.id}>
                {(displayUser.displayName && capitalizeFirstLetter(displayUser.displayName)) || 'No name'}
               </Link>
            </h6>
            {
              isFollowerLoading
                ? <i className='fa fa-spinner fa-spin'></i>
                : <div>
                  <button className='btn btn-sm btn-violet-outline' onClick={e => relationStatus('accept_request')}>
                    Accept
                  </button>
                  <button className='btn btn-sm ml-2' onClick={e => relationStatus('decline_request')}>
                    Decline
                  </button>
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
