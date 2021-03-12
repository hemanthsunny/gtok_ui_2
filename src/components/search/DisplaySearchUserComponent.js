import React, { useState, useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { getId, getQuery, firestore } from 'firebase_config'
import { NotificationComponent } from 'components'
import { capitalizeFirstLetter } from 'helpers'
import { gtokFavicon } from 'images'
import { createRelationships } from 'lib/api'
import { SetRelationships } from 'store/actions'

const DisplaySearchUserComponent = ({
  currentUser, displayUserId, status, allUsers, bindRelationships
}) => {
  const history = useHistory()
  const [follower, setFollower] = useState(status)
  const [isFollowerLoading, setIsFollowerLoading] = useState(false)
  const [result, setResult] = useState({})
  const [displayUser, setDisplayUser] = useState('')
  /*
  const StatusCodes = {
    0: 'Pending',
    1: 'Accepted/Followed',
    2: 'Declined',
    3: 'Blocked'
  } */

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
    const res = await createRelationships(currentUser, displayUser, status)
    await bindRelationships(currentUser)
    const rlns = await getQuery(
      firestore.collection('userRelationships').where('userIdOne', '==', currentUser.id).where('userIdTwo', '==', displayUser.id).get()
    )
    if (rlns[0]) setFollower(rlns[0].status)
    setIsFollowerLoading(false)
    setResult(res)
  }

  const msgUser = async () => {
    history.push('/app/chats/new/' + displayUser.id)
  }

  return (
    <div className='col-xs-12 my-xs-2 my-md-3'>
      <div className='card p-2 card-br-0'>
        {result.status && <NotificationComponent result={result} setResult={setResult} />}
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
                <button className={`btn btn-sm ${follower ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={e => relationStatus('follow')}>
                {
                  isFollowerLoading
                    ? <i className='fa fa-spinner fa-spin'></i>
                    : (
                    <small className='pull-right'>{
                      follower === 0
                        ? 'Pending'
                        : (
                            follower === 1
                              ? 'Following'
                              : (
                                  follower === 3 ? 'Blocked' : 'Follow'
                                )
                          )
                    }</small>
                      )
                }
                </button>
                <button type='button' className='btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split pt-0 pb-0' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                  <span className='sr-only'>Toggle Dropdown</span>
                </button>
                <div className='dropdown-menu'>
                  { follower === 0 &&
                    <button className='dropdown-item' onClick={e => relationStatus('accept_request')}>
                      <i className='fa fa-tick'></i> Accept Request
                    </button>}
                  { follower === 0 &&
                    <button className='dropdown-item' onClick={e => relationStatus('decline_request')}>
                      <i className='fa fa-times'></i> Decline Request
                    </button>}
                  { follower === 1 &&
                    <button className='dropdown-item' onClick={e => relationStatus('unfollow')}>
                      <i className='fa fa-times'></i>&nbsp;Unfollow
                    </button>}
                  { follower !== 3 &&
                    <button className='dropdown-item' onClick={e => relationStatus('block')}>
                      <i className='fa fa-ban'></i>&nbsp; Block
                    </button>}
                  { follower === 3 &&
                    <button className='dropdown-item' onClick={e => relationStatus('unblock')}>
                      <i className='fa fa-ban'></i>&nbsp; Unblock
                    </button>}
                </div>
              </div>
              <Link to={'/app/profile/' + displayUser.id} className='btn btn-outline-secondary btn-sm pull-right ml-2' title='Show similarities'>
                <i className='fa fa-bar-chart'></i>
              </Link>
              <button className='btn btn-sm btn-outline-secondary pull-right' onClick={e => msgUser()} title='Start chat'>
                <i className='fa fa-comment'></i>
              </button>
            {/*
              <button className='btn btn-sm btn-outline-secondary pull-right' onClick={e => createRelationships(displayUser)} title='Start chat'>
                Add relations
              </button>
            */}
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
)(DisplaySearchUserComponent)
