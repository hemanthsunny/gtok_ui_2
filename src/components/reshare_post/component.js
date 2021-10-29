import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import './style.css'

import HeaderComponent from './header'
import DetailComponent from './steps/detail/component'

import { add, update, getId, timestamp, batchWrite } from 'firebase_config'
import { capitalizeFirstLetter } from 'helpers'
import { SetNewPost } from 'store/actions'

const ParentComponent = (props) => {
  const sharePost = (props.history.location.state && props.history.location.state.sharePost) || {}
  const story = (props.history.location.state && props.history.location.state.story) || {
    text: '',
    fileUrl: null
  }

  const { currentUser, bindNewPost } = props
  const [postText, setPostText] = useState(story.text)
  const [resharePost, setResharePost] = useState('')
  const [result, setResult] = useState({})

  useEffect(() => {
    async function getResharePost () {
      const res = await getId('posts', sharePost.resharePostId)
      setResharePost(res)
    }
    if (!resharePost && sharePost && sharePost.resharePostId) {
      getResharePost()
    }
  })
  console.log('lll', sharePost)
  const savePost = async (opts) => {
    const postData = Object.assign({
      active: true,
      category: {
        title: 'Same pinch',
        key: 'same_pinch'
      },
      stories: [{
        text: capitalizeFirstLetter(postText.trim())
      }],
      userId: currentUser.id,
      followers: [],
      followersCount: 0,
      resharePostId: sharePost.id,
      timestamp,
      ...opts
    })

    let result
    if (sharePost.resharePostId) {
      result = await update('posts', sharePost.id, {
        stories: [{
          text: capitalizeFirstLetter(postText.trim())
        }]
      })
    } else {
      result = await add('posts', postData)
    }
    // When a new post added, alert all followers
    await sendAlertsToFollowers(result.data, postData)
    bindNewPost(currentUser)
    /* Log the activity */
    // await add('logs', {
    //   text: `${currentUser.displayName} created a post`,
    //   photoURL: currentUser.photoURL,
    //   receiverId: '',
    //   userId: currentUser.id,
    //   actionType: 'create',
    //   collection: 'posts',
    //   timestamp
    // })

    if (result.status === 200) {
      props.history.push({
        pathname: '/app/assets',
        state: { postingSuccess: true, reloadPosts: true }
      })
    } else {
      setResult(result)
    }
  }

  const sendAlertsToFollowers = async (res = {}, post) => {
    if (res.path && !post.anonymous) {
      /* Send alerts to all followers */
      const relationsIds = _.without(_.map(props.relations, rln => {
        if (rln.userIdTwo === currentUser.id && rln.status === 1) {
          return rln.userIdOne
        }
      }), undefined)
      await batchWrite('logs', relationsIds, {
        text: `@${currentUser.username} reshared a ${sharePost.tradePrice && 'trade '}feeling. Check it now.`,
        photoURL: currentUser.photoURL,
        userId: currentUser.id,
        actionLink: `/app/${res.path}`,
        unread: true,
        timestamp
      })
    }
  }

  return (
    <div>
      <HeaderComponent save={savePost} />
      <div className='dashboard-content pt-4 pt-md-5 mt-md-5'>
          <div className='container create-post-wrapper'>
            <DetailComponent postText={postText} setPostText={setPostText} currentUser={currentUser} sharePost={resharePost} />
            <div className='text-center'>
              {
                result.status &&
                <div className={`text-${result.status === 200 ? 'success' : 'danger'} mb-2`}>
                  {result.message}
                </div>
              }
            </div>
          </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { relations } = state.relationships
  const { wallet } = state.wallet
  const { prices } = state.prices
  return { relations, wallet, prices }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindNewPost: (content) => dispatch(SetNewPost(content))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ParentComponent))
