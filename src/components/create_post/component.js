import React, { useState } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { motion } from 'framer-motion'
import _ from 'lodash'
import './style.css'

import HeaderComponent from './header'
import DetailComponent from './steps/detail/component'
import CategoryComponent from './steps/category/component'

import { add, update, timestamp, uploadFile, removeFile, batchWrite } from 'firebase_config'
import { FeelingCategories } from 'constants/categories'
import { capitalizeFirstLetter } from 'helpers'
import { SetNewPost } from 'store/actions'

const pageVariants = {
  initial: {
    opacity: 0,
    x: '-100vw',
    scale: 0.8
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: '100vw',
    scale: 1.2
  }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 1
}

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
    title: 'Current feeling',
    key: 'current_feeling'
  })
  const [result, setResult] = useState({})
  const [fileUrl, setFileUrl] = useState(story.fileUrl)
  const [btnUpload, setBtnUpload] = useState('upload')
  const [anonymous, setAnonymous] = useState(sharePost.anonymous || false)
  const [tradePrice, setTradePrice] = useState(sharePost.tradePrice || 10)
  const [tradePost, setTradePost] = useState(false)

  const savePost = async (opts) => {
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
        pathname: '/app/posts',
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
        text: `@${currentUser.username} recently shared a feeling. Show your support now.`,
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

  // const nextpst = async (stories, id) => {
  //   const nxtPost = await getId('posts', id)
  //   stories.push({
  //     text: nxtPost.text,
  //     fileUrl: nxtPost.fileUrl,
  //     createdAt: nxtPost.createdAt
  //   })
  //   if (nxtPost.nextId) { await nextpst(stories, nxtPost.nextId) }
  //   return stories
  // }

  // const updateAdditionalStories = async () => {
  //   const psts = await get('posts')
  //   psts.map(async p => {
  //     if (!p.stories && !p.prevId) {
  //       console.log('p.id', p.id)
  //     }
  //     if (!p.prevId && p.nextId) {
  //       const parentPst = p
  //       parentPst.stories = [
  //         {
  //           text: p.text,
  //           fileUrl: p.fileUrl,
  //           createdAt: p.createdAt
  //         }
  //       ]
  //       await nextpst(parentPst.stories, parentPst.nextId)
  //       // console.log('res', res, ')))', parentPst);
  //       // await update('posts', p.id, {stories: parentPst['stories']});
  //     } else if (!p.prevId && !p.nextId) {
  //       await update('posts', p.id, {
  //         stories: [{
  //           text: p.text,
  //           fileUrl: p.fileUrl || null,
  //           createdAt: p.createdAt
  //         }]
  //       })
  //     }
  //   })
  // }

  const subHeader = () => (
    <div className='dashboard-tabs' role='navigation' aria-label='Main'>
      <div className='tabs -big'>
        <Link to='/app/create_post' className='tab-item -active'>Feelings</Link>
        <Link to='/app/create_activity' className='tab-item'>Activities</Link>
      </div>
    </div>
  )

  return (
    <div>
      <HeaderComponent save={savePost} />
      <div>
        <div className='dashboard-content pt-4'>
          {subHeader()}
            <div className='container create-post-wrapper'>
              <DetailComponent btnUpload={btnUpload} fileUrl={fileUrl} uploadAudio={uploadAudio} deleteFile={deleteFile} postText={postText} setPostText={setPostText} currentUser={currentUser} category={category} tradePrice={tradePrice} setTradePrice={setTradePrice} anonymous={anonymous} setAnonymous={setAnonymous} tradePost={tradePost} setTradePost={setTradePost} />
              <CategoryComponent postCategories={FeelingCategories} category={category} setCategory={setCategory} currentUser={currentUser} />
              <div className='text-center'>
                {
                  result.status &&
                  <div className={`text-${result.status === 200 ? 'success' : 'danger'} mb-2`}>
                    {result.message}
                  </div>
                }
              </div>
            </div>
          <motion.div initial='initial' animate='in' exit='out' variants={pageVariants} transition={pageTransition}>
          </motion.div>
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
