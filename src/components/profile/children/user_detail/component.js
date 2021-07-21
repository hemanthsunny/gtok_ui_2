import React, { useState, useEffect } from 'react'
import { Link, withRouter, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import { getId, getQuery, add, update, firestore } from 'firebase_config'
import { capitalizeFirstLetter } from 'helpers'
import { CustomImageComponent } from 'components'

import { SetDbUser } from 'store/actions'

function Component (props) {
  const { currentUser, purchaseOrders } = props
  const [user, setUser] = useState(currentUser)
  const userId = props.match.params.user_id || currentUser.id
  const purchaseFound = purchaseOrders.find(order => (order.profileUserId === userId && order.purchaseOrderStatus === 'active'))
  const [follower, setFollower] = useState('')
  const [isFollowerLoading, setIsFollowerLoading] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [followersCount, setFollowersCount] = useState('')
  const [followingCount, setFollowingCount] = useState('')
  const history = useHistory()

  useEffect(() => {
    async function getUser (uid) {
      let u = await getId('users', uid)
      u = Object.assign(u, { id: uid })
      setUser(u)
    }
    getUser(userId || currentUser.id)

    async function getRelationships () {
      /* get relationship status */
      const rlns = await getQuery(
        firestore.collection('userRelationships').where('userIdOne', '==', currentUser.id).where('userIdTwo', '==', userId).get()
      )
      if (rlns[0]) setFollower(rlns[0])

      const uid = userId || currentUser.id
      /* get followers count */
      const ersCount = await getQuery(
        firestore.collection('userRelationships').where('userIdTwo', '==', uid).where('status', '==', 1).get()
      )
      setFollowersCount(ersCount.length)

      /* get following count */
      const ingCount = await getQuery(
        firestore.collection('userRelationships').where('userIdOne', '==', uid).where('status', '==', 1).get()
      )
      setFollowingCount(ingCount.length)
    }
    /* get relationships */
    getRelationships()

    /* setIsAdminUser when current user is not equal to view profile user */
    if ((currentUser.id === userId) || !userId) {
      setIsAdminUser(true)
    }
  }, [userId])

  const showEligibilityRules = () => {
    alert('You must have at least 500 followers and 100 legitimate posts to use this feature.')
    return null
  }

  const relationStatus = async (status) => {
    if (status === 'follow') {
      status = user.private ? 0 : 1
    } else {
      status = null
    }
    setIsFollowerLoading(true)
    if (follower) {
      await update('userRelationships', follower.id, { status: status })
    } else {
      const data = {
        userIdOne: currentUser.id,
        userIdTwo: userId,
        status
      }
      await add('userRelationships', data)
    }
    const rlns = await getQuery(
      firestore.collection('userRelationships').where('userIdOne', '==', currentUser.id).where('userIdTwo', '==', userId).get()
    )
    if (rlns[0]) setFollower(rlns[0])
    setIsFollowerLoading(false)
  }

  const goBack = () => {
    if (userId !== currentUser.id) history.goBack()
    else history.push('/')
  }

  const unfollow = async () => {
    if (window.confirm(`Are you sure to unfollow ${user.username}?`)) {
      await relationStatus('unfollow')
    }
  }

  const seeFollowers = async () => {
    if (isAdminUser) {
      history.push('/app/followers')
    } else {
      alert(`You cannot see @${user.username} followers`)
    }
  }

  const seeFollowing = async () => {
    if (isAdminUser) {
      history.push('/app/following')
    } else {
      alert(`You cannot see @${user.username} followers`)
    }
  }

  return (
    <div className='profile-wrapper'>
      <div className='container'>
        <div className='d-flex justify-content-between align-items-baseline py-3 px-3'>
          <div onClick={goBack}>
            <img src={require('assets/svgs/LeftArrowWhite.svg').default} className='posts-icon pull-left' alt='Posts' />
          </div>
          <div className='fw-500'>
            @{user.username}
          </div>
          <Link to='/app/settings'>
            <img src={require('assets/svgs/Settings.svg').default} className={`posts-icon pull-left ${!isAdminUser && 'd-none'}`} alt='Posts' />
          </Link>
        </div>
        <div className='row profile-info'>
          <div className='col-4' onClick={seeFollowers}>
            Followers <br/>
            {followersCount}
          </div>
          <div className='col-4 fw-500 px-2'>
            <div className='display-picture'>
              <CustomImageComponent user={user} size='lg' style={{ margin: '0px auto' }} />
            </div>
            <div className='my-2'>{capitalizeFirstLetter(user.displayName)}</div>
          </div>
          <div className='col-4 px-2' onClick={seeFollowing}>
            Following <br/>
            {followingCount}
          </div>
        </div>
        {
          user.bio && <p className='profile-bio'>{user.bio}</p>
        }
        {
          isFollowerLoading && <i className='fa fa-spinner fa-spin'></i>
        }
      </div>
      {
        isAdminUser &&
          <div className='text-center'>
            <Link to='/app/wallet' className='btn btn-custom col-4 mr-2'>Wallet</Link>
            <div className='btn btn-violet col-2 d-none'></div>
            <Link to='/app/settings/edit_profile' className='btn btn-custom col-4 ml-2'>Edit profile</Link>
          </div>
      }
      {
        !isAdminUser && follower.status === 1 &&
          <div className='text-center'>
            <div className='btn btn-custom col-4 mr-2' onClick={unfollow}>Following</div>
            <div className='btn btn-violet col-2 d-none'></div>
            <div className='btn btn-custom col-4 ml-2'>Message</div>
          </div>
      }
      {
        !isAdminUser && follower.status === 0 &&
          <div className='text-center'>
            <div className='btn btn-custom col-1 d-none'></div>
            <div className='btn btn-custom col-7 mr-1' onClick={e => relationStatus('cancel_request')}>
              Request sent &nbsp;
              <img className='icon-request-sent' src={require('assets/svgs/SentRequest.svg').default} alt="Pending" />
            </div>
            <div className='btn btn-custom col-2 ml-1'>
              <img className='icon-search-chat' src={require('assets/svgs/ChatBlack.svg').default} alt="1" />
            </div>
          </div>
      }
      {
        !isAdminUser && (follower.status === undefined || follower.status === null) &&
          <div className='text-center'>
            <div className='btn btn-custom col-7 mr-1' onClick={e => relationStatus('follow')}>
              Follow &nbsp;
              <img className='icon-request-sent' src={require('assets/svgs/SendRequest.svg').default} alt="Follow" />
            </div>
            <div className='btn btn-custom col-2 ml-1'>
              <img className='icon-search-chat' src={require('assets/svgs/ChatBlack.svg').default} alt="1" />
            </div>
          </div>
      }

      <div className='card posts-wrapper my-2 p-2 d-none'>
        <div className='p-3 d-none'>
          <Link to={`/app/profile/${userId || currentUser.id}/posts`} className='d-flex align-items-center'>
            <img src={require('assets/svgs/Plus.svg').default} className='posts-icon pull-left' alt='Posts' />
            <span className='option-name col-8'>Posts</span>
            <img src={require('assets/svgs/RightArrow.svg').default} className='right-icon col-3' alt='RightArrow' />
          </Link>
        </div>
        {
          userId && (userId !== currentUser.id)
            ? (
                purchaseFound
                  ? <div className='posts-footer'>
              <div className='col-xs-12 col-sm-10'>
                Unlocked &nbsp;<b>@{user.username}</b>&nbsp; inner feelings and secret activities &nbsp;
              </div>
              <div className='col-xs-12 col-sm-2 text-center pt-2 pt-sm-0'>
                <button className='btn btn-sm btn-violet'><i className='fa fa-check'></i></button>
              </div>
            </div>
                  : <div className='posts-footer'>
              <div className='col-xs-12 col-sm-10'>
                Unlock &nbsp;<b>@{user.username}</b>&nbsp; inner feelings and secret activities &nbsp;
              </div>
              <div className='col-xs-12 col-sm-2 text-center pt-2 pt-sm-0'>
                <button className='btn btn-sm btn-violet' onClick={e => alert(`@${user.username} doesn't have any secret posts yet. Once he/she has made at least one secret post, you can purchase.`)}>Purchase</button>
              </div>
            </div>
              )
            : <div className='posts-footer'>
            <div className='col-xs-12 col-sm-10'>
              Start making money by selling your inner feelings and activities
            </div>
            <div className='col-xs-12 col-sm-2 text-center pt-2 pt-sm-0'>
              <button className='btn btn-sm btn-violet' onClick={showEligibilityRules}>Start Earning</button>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { relations } = state.relationships
  const { purchaseOrders } = state.purchaseOrders
  return { relations, purchaseOrders }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindDbUser: (content) => dispatch(SetDbUser(content))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Component))
