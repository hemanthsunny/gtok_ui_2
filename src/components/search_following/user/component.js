import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { getQuery, firestore } from 'firebase_config'
import { NotificationComponent, CustomImageComponent } from 'components'
import { capitalizeFirstLetter } from 'helpers'
import { createRelationships } from 'lib/api'
import { SetRelationships } from 'store/actions'

const UserComponent = ({
  currentUser, displayUser, allUsers, bindRelationships
}) => {
  const history = useHistory()
  const [isFollowerLoading, setIsFollowerLoading] = useState(false)
  const [result, setResult] = useState({})
  /*
  const StatusCodes = {
    0: 'Pending',
    1: 'Accepted/Followed',
    2: 'Declined',
    3: 'Blocked'
  } */

  const relationStatus = async (status) => {
    setIsFollowerLoading(true)
    const res = await createRelationships(currentUser, displayUser, status)
    await bindRelationships(currentUser)
    await getQuery(
      firestore.collection('userRelationships').where('userIdOne', '==', currentUser.id).where('userIdTwo', '==', displayUser.id).get()
    )
    setIsFollowerLoading(false)
    setResult(res)
  }

  const msgUser = async () => {
    history.push('/app/chats/new/' + displayUser.id)
  }

  return (
    <div className='col-xs-12 col-sm-6 col-lg-4 my-2 my-md-3'>
      <div className='card p-3 card-br-0'>
        {result.status && <NotificationComponent result={result} setResult={setResult} />}
        <div className='media profile_card_img'>
          <Link to={'/app/profile/' + displayUser.id}>
            <CustomImageComponent user={displayUser} size='lg' />
          </Link>
          <div className='media-body pl-3'>
            <h6 className='mt-0 text-camelcase'>
              <Link to={'/app/profile/' + displayUser.id}>
                {(displayUser.displayName && capitalizeFirstLetter(displayUser.displayName)) || 'No name'}
               </Link>
            </h6>
            <div>
              <div className='btn-group'>
                <button className='btn btn-sm btn-violet-outline'>
                {
                  isFollowerLoading
                    ? <i className='fa fa-spinner fa-spin'></i>
                    : (
                      <small className='pull-right'>Following</small>
                      )
                }
                </button>
                <button type='button' className='btn btn-sm btn-violet-outline dropdown-toggle dropdown-toggle-split pt-0 pb-0' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                  <span className='sr-only'>Toggle Dropdown</span>
                </button>
                <div className='dropdown-menu'>
                  <button className='dropdown-item' onClick={e => relationStatus('unfollow')}>
                    <i className='fa fa-times'></i>&nbsp;Unfollow
                  </button>
                  <button className='dropdown-item' onClick={e => relationStatus('block')}>
                    <i className='fa fa-ban'></i>&nbsp; Block
                  </button>
                </div>
              </div>
              <button className='btn btn-sm btn-outline-secondary ml-3' onClick={e => msgUser()} title='Start chat'>
                <i className='fa fa-comment'></i>
              </button>
            </div>
          </div>
        </div>
        <div className='pull-right pt-0'>
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
)(UserComponent)
