import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'

import {
  remove,
  getId
} from 'firebase_config'
import { SetPosts, SetSharePost, SetUpdatedPost } from 'store/actions'
import { ReportPostComponent } from 'components'

const Component = ({
  currentUser, activity, purchaseOrders, allUsers
}) => {
  const [postedUser, setPostedUser] = useState('')
  const [showComments, setShowComments] = useState(false)

  const purchaseFound = purchaseOrders.find(order => (order.profileUserId === activity.userId && order.active))
  const history = useHistory()

  useEffect(() => {
    async function getPostedUser () {
      let result = allUsers.find(user => user.id === activity.userId)
      if (!result) {
        result = await getId('users', activity.userId)
      }
      result.id = activity.userId
      setPostedUser(result)
    }
    if (activity.anonymous) {
      setPostedUser({
        id: activity.userId,
        displayName: 'Anonymous'
      })
    } else {
      getPostedUser()
    }
  }, [activity, allUsers])

  const deleteActivity = async (activity) => {
    if (activity.id && window.confirm('Are you sure to delete this activity?')) {
      await remove('activities', activity.id)
      /* Log the activity */
      // await add('logs', {
      //   text: `${currentUser.displayName} removed the post`,
      //   photoURL: currentUser.photoURL,
      //   receiverId: '',
      //   userId: currentUser.id,
      //   actionType: 'delete',
      //   collection: 'posts',
      //   actionId: displayPost.id,
      //   actionKey: 'id',
      //   actionLink: '/app/profile/'+currentUser.id,
      //   timestamp
      // });
      // this.setState(result);
    }
  }

  const redirectToProfile = async () => {
    history.push('/app/profile/' + activity.userId)
  }

  return activity.id && (
    <div className='card activity-card-wrapper'>
      <ReportPostComponent postId={activity.id} currentUser={currentUser} collection='activities' />
      <div>
        <span className='card-badge mr-2'>{moment(activity.createdAt).format('DD/MM/YY HH:mm')}</span>
        <span className='card-badge mr-2'>
          {activity.anonymous ? <span>@Anonymous</span> : <span className='pointer' onClick={e => redirectToProfile()}>@{postedUser.username}</span>}
        </span>
      </div>
      {
        (activity.premium && !purchaseFound && (currentUser.id !== activity.userId))
          ? <div className='card-body'>
          <div className='blur-post'>
            This activity is secret. <br/> Purchase now to view it.
          </div>
          <Link to={`/app/profile/${activity.userId}/unlock_profile`} className='btn btn-sm btn-violet'>
            Unlock
          </Link>
        </div>
          : <div className='card-body'>
          <div>
            <div className='white-space-preline'>
              {activity.activity}
            </div>
            <div className='description'>{activity.description}</div>
          </div>
        </div>
      }
      <div className='media card-details'>
        <div className='media-body'>
          <div className='d-flex flex-inline align-items-center float-left'>
            <button className='btn btn-violet btn-sm' onClick={e => setShowComments(!showComments)}>Show support</button>
            <div className={`${!showComments && 'd-none'}`}>
              <button className='btn btn-violet-outline btn-sm mx-2 px-2'>Admire you</button>
              <button className='btn btn-violet-outline btn-sm mx-2 px-2'>Appreciate your effort</button>
              <button className='btn btn-violet-outline btn-sm mx-2 px-2'>Wanna be like you</button>
              <button className='btn btn-violet-outline btn-sm mx-2 px-2'>Love you</button>
            </div>
          </div>
          <div className='edit-options float-right'>
            <button className={`btn btn-link ${(activity.userId !== currentUser.id) && 'd-none'}`} onClick={e => deleteActivity(activity)}>
              <i className='fa fa-trash'></i>
            </button>
            <button className={`btn btn-link ${(activity.userId !== currentUser.id) && 'd-none'}`} data-toggle='modal' data-target='#reportPostModal'>
              <i className='fa fa-flag'></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { allUsers } = state.users
  const { purchaseOrders } = state.purchaseOrders
  return { allUsers, purchaseOrders }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindPosts: (content) => dispatch(SetPosts(content)),
    bindSharePost: (content, type, data) => dispatch(SetSharePost(content, type, data)),
    bindUpdatedPost: (content, type, data) => dispatch(SetUpdatedPost(content, type, data))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
