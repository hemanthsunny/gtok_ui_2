import React, { useState } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'

import HeaderComponent from './header'
import DetailComponent from './steps/detail/component'
import CategoryComponent from './steps/category/component'

import { add, update, timestamp, uploadFile, removeFile, batchWrite } from 'firebase_config'
import { ActivityCategories } from 'constants/categories'
import { capitalizeFirstLetter } from 'helpers'
import { SetNewPost } from 'store/actions'

const ParentComponent = (props) => {
  const sharePost = (props.history.location.state && props.history.location.state.sharePost) || {}
  const story = (props.history.location.state && props.history.location.state.story) || {
    text: '',
    fileUrl: null
  }
  const storyIdx = (props.history.location.state && props.history.location.state.storyIdx) || ''

  const { currentUser, bindNewPost } = props
  const [postText, setPostText] = useState(story.text)
  const [category, setCategory] = useState(sharePost.category || {
    title: 'Current activity',
    key: 'current_activity'
  })
  const [result, setResult] = useState({})
  const [fileUrl, setFileUrl] = useState(story.fileUrl)
  const [btnUpload, setBtnUpload] = useState('upload')
  const [anonymous, setAnonymous] = useState(sharePost.anonymous || false)
  const [tradePrice, setTradePrice] = useState(sharePost.tradePrice || 10)
  const [tradePost, setTradePost] = useState(false)

  const save = async (opts) => {
    if (!postText) {
      alert('Write something before you post')
      return null
    }
    if (!category || !category.title) {
      alert('Please select a category')
      return null
    }
    let result = ''
    let postData = {}
    if (sharePost.id) {
      sharePost.stories.splice(storyIdx, 1, { text: capitalizeFirstLetter(postText.trim()), fileUrl })
      postData = Object.assign(postData, {
        stories: sharePost.stories,
        category,
        tradePrice: tradePost ? tradePrice : 0,
        ...opts
      })
      result = await update('posts', sharePost.id, postData)
      postData = Object.assign(postData, { id: sharePost.id })
      await bindNewPost(postData)
    } else {
      postData = Object.assign(postData, {
        active: true,
        type: 'activity',
        stories: [{
          text: capitalizeFirstLetter(postText.trim()),
          fileUrl
        }],
        userId: currentUser.id,
        followers: [],
        followersCount: 0,
        category,
        timestamp,
        tradePrice: tradePost ? tradePrice : 0,
        ...opts
      })
      result = await add('posts', postData)
      // When a new post added, alert all followers
      await sendAlertsToFollowers(result.data, postData)
    }
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
        text: `@${currentUser.username} recently shared an activity.`,
        photoURL: currentUser.photoURL,
        userId: currentUser.id,
        actionLink: `/app/${res.path}`,
        unread: true,
        timestamp
      })
    }
  }

  const uploadAudio = async (file) => {
    if (!file) {
      setResult({
        status: 400,
        message: 'A new audio required'
      })
      return null
    }
    setBtnUpload('uploading')
    await uploadFile(file, 'audio', (url) => {
      setFileUrl(url)
      setBtnUpload('upload')
    })
  }

  const deleteFile = async () => {
    if (window.confirm('Are you sure to remove audio?')) {
      await removeFile(fileUrl)
      setFileUrl(prevState => {
        return ''
      })
    }
  }

  const subHeader = () => (
    <div className='dashboard-tabs' role='navigation' aria-label='Main'>
      <div className='tabs -big'>
        <Link to='/app/create_asset' className='tab-item'>Feelings</Link>
        <Link to='/app/create_activity' className='tab-item -active'>Activities</Link>
      </div>
    </div>
  )

  return (
    <div>
      <HeaderComponent save={save} sharePost={sharePost} />
      <div>
        <div className='dashboard-content pt-4'>
          {!sharePost.id && subHeader()}
            <div className='container create-post-wrapper'>
              <DetailComponent btnUpload={btnUpload} fileUrl={fileUrl} uploadAudio={uploadAudio} deleteFile={deleteFile} postText={postText} setPostText={setPostText} currentUser={currentUser} category={category} tradePrice={tradePrice} setTradePrice={setTradePrice} anonymous={anonymous} setAnonymous={setAnonymous} tradePost={tradePost} setTradePost={setTradePost} wallet={props.wallet} />
              <CategoryComponent postCategories={ActivityCategories} category={category} setCategory={setCategory} currentUser={currentUser} />
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
