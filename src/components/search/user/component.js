import React, { useState, useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { getQuery, firestore } from 'firebase_config'
import { NotificationComponent, CustomImageComponent } from 'components'
import { capitalizeFirstLetter } from 'helpers'
import { createRelationships } from 'lib/api'
import { SetRelationships } from 'store/actions'

const SearchUserComponent = ({ displayUser, currentUser, relations, bindRelationships }) => {
  const history = useHistory()
  const [follower, setFollower] = useState(null)
  const [isFollowerLoading, setIsFollowerLoading] = useState(false)
  const [result, setResult] = useState({})
  /*
  const StatusCodes = {
    0: 'Pending',
    1: 'Accepted/Followed',
    2: 'Declined',
    3: 'Blocked'
  } */

  useEffect(() => {
    if (relations[0]) {
      const relation = relations.find(rln => rln.userIdOne === currentUser.id && rln.userIdTwo === displayUser.id)
      if (relation && relation.id) {
        setFollower(relation.status)
      }
    }
  }, [relations, currentUser, displayUser])

  const relationStatus = async (status) => {
    console.log(status, '---')
    if (status === 'block' &&
      !window.confirm('Are you sure to block ' + displayUser.displayName + '?')) {
      return null
    }
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
    if (!follower) {
      alert('You must be a follower before sending a message')
      return null
    }
    history.push('/app/chats/new/' + displayUser.id)
  }

  return (
    <div className='col-xs-12 col-sm-6 col-lg-4 my-2 my-md-3'>
      <div className='p-0 card-br-0'>
        {result.status && <NotificationComponent result={result} setResult={setResult} />}
        <div className='media profile-user'>
          <Link to={'/app/profile/' + displayUser.id}>
            <CustomImageComponent user={displayUser} />
          </Link>
          <div className='media-body pl-3'>
            <Link className='username' to={'/app/profile/' + displayUser.id}>
              {displayUser.username}<br/>
              <span className='actual-name'>{(displayUser.displayName && capitalizeFirstLetter(displayUser.displayName)) || 'No name'}</span>
             </Link>
            <div className='pull-right'>
              <div className=''>
                <button className='btn btn-link'>
                {
                  isFollowerLoading
                    ? <i className='fa fa-spinner fa-spin'></i>
                    : (
                    <small className='pull-right'>{
                      follower === null
                        ? <img className='icon-search-chat' src={require('assets/svgs/SendRequest.svg').default} alt="1" onClick={e => relationStatus('follow')} />
                        : follower === 0
                          ? <img className='icon-search-chat' src={require('assets/svgs/SentRequest.svg').default} alt="1" onClick={e => relationStatus('cancel_request')} />
                          : (
                              follower === 3 && 'Blocked'
                            )
                    }</small>
                      )
                }
                </button>
                <button type='button' className='d-none btn btn-sm btn-violet-outline dropdown-toggle dropdown-toggle-split pt-0 pb-0' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                  <span className='sr-only'>Toggle Dropdown</span>
                </button>
                <div className='dropdown-menu d-none'>
                  { follower === 0 &&
                    <button className='dropdown-item' onClick={e => relationStatus('cancel_request')}>
                      <i className='fa fa-times'></i>&nbsp;Cancel Request
                    </button>}
                  { follower === 1 &&
                    <button className='dropdown-item' onClick={e => relationStatus('unfollow')}>
                      <i className='fa fa-times'></i>&nbsp;Unfollow
                    </button>}
                  { follower !== 0 && follower !== 3 &&
                    <button className='dropdown-item' onClick={e => relationStatus('block')}>
                      <i className='fa fa-ban'></i>&nbsp; Block
                    </button>}
                  { follower === 3 &&
                    <button className='dropdown-item' onClick={e => relationStatus('unblock')}>
                      <i className='fa fa-ban'></i>&nbsp; Unblock
                    </button>}
                </div>
                {
                  follower !== 3 &&
                  <button className='btn btn-link py-1 px-0 pull-right' onClick={e => msgUser()} title='Start chat'>
                    <img className='icon-search-chat' src={require('assets/svgs/ChatBlack.svg').default} alt="1" />
                  </button>
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
  const { relations } = state.relationships
  return { relations }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindRelationships: (content, type) => dispatch(SetRelationships(content, type))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchUserComponent)
