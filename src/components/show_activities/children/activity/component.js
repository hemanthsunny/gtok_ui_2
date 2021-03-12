import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'

import {
  remove
} from 'firebase_config'
import { SetPosts, SetSharePost, SetUpdatedPost } from 'store/actions'

const Component = ({
  currentUser, activity, purchaseOrders
}) => {
  const purchaseFound = purchaseOrders.find(order => (order.profileUserId === activity.userId && order.active))

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

  return activity.id && (
    <div className='card activity-card-wrapper'>
      <div>
        <span className='card-badge mr-2'>{moment(activity.createdAt).format('DD/MM/YY HH:mm')}</span>
        <span className='card-badge'>{activity.activity || 'Activity'}</span>
        <div className='card-follow'>
          <button className='btn btn-link p-0 pr-2' onClick={e => deleteActivity(activity)}>
            <i className='fa fa-trash'></i>
          </button>
        </div>
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
              {activity.text}
            </div>
            <div className='description'>{activity.description}</div>
          </div>
        </div>
      }
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
