import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import './style.css'

import {
  add,
  arrayAdd,
  arrayRemove,
  getId,
  update,
  remove,
  removeFile,
  timestamp
} from 'firebase_config'
import { SetPosts, SetSharePost, SetUpdatedPost } from 'store/actions'
import { NotificationComponent, ReportPostComponent, CustomImageComponent } from 'components'
import { PostCategories } from 'constants/categories'

const PostComponent = ({
  currentUser, post, bindPosts, hideSimilarityBtn = false, bindSharePost, hideShareBtn = false, hideRedirects = false, allUsers, bindUpdatedPost, purchaseOrders
}) => {
  const [displayPost, setDisplayPost] = useState(post)
  const [postedUser, setPostedUser] = useState('')
  const [follower, setFollower] = useState(!!displayPost.followers.find(f => f === currentUser.id))
  const [followerLoading, setFollowerLoading] = useState(false)
  const [result, setResult] = useState({})
  const [activeIndex, setActiveIndex] = useState(0)
  const [play, setPlay] = useState(true)
  const [playDetails, setPlayDetails] = useState('')
  const [displayFullStory, setDisplayFullStory] = useState(false)
  const [hidePost, setHidePost] = useState(false)

  const purchaseFound = purchaseOrders.find(order => (order.profileUserId === displayPost.userId && order.active))
  const history = useHistory()
  const displayPostUrl = 'https://app.letsgtok.com/app/posts/' + displayPost.id

  useEffect(() => {
    async function getPostedUser () {
      let result = allUsers.find(user => user.id === displayPost.userId)
      if (!result) {
        result = await getId('users', displayPost.userId)
      }
      result.id = displayPost.userId
      setPostedUser(result)
    }
    if (displayPost.anonymous) {
      setPostedUser({
        id: displayPost.userId,
        displayName: 'Anonymous'
      })
    } else {
      getPostedUser()
    }
  }, [displayPost, allUsers])

  const followPost = async (e) => {
    // if (currentUser.id === postedUser.id) {
    //   alert('You cannot follow yourself.')
    //   return null;
    // }
    setFollowerLoading(true)
    if (!follower) {
      await update('posts', displayPost.id, { followers: arrayAdd(currentUser.id), followersCount: displayPost.followers.length + 1 })
      /* Log the activity */
      await add('logs', {
        text: `${currentUser.displayName} pinches your post`,
        photoURL: currentUser.photoURL,
        receiverId: postedUser.id,
        userId: currentUser.id,
        actionType: 'update',
        collection: 'posts',
        actionId: displayPost.id,
        actionKey: 'followers',
        actionLink: '/app/posts/' + displayPost.id,
        unread: true,
        timestamp
      })
      setFollower(true)
    } else {
      await update('posts', displayPost.id, { followers: arrayRemove(currentUser.id), followersCount: displayPost.followers.length - 1 })
      /* Log the activity */
      await add('logs', {
        text: `${currentUser.displayName} removed pinch for your post`,
        photoURL: currentUser.photoURL,
        receiverId: '',
        userId: currentUser.id,
        actionType: 'update',
        collection: 'posts',
        actionId: displayPost.id,
        actionKey: 'followers',
        actionLink: '/app/posts/' + displayPost.id,
        timestamp
      })
      setFollower(false)
    }
    await getUpdatedPost(displayPost.id)
    setFollowerLoading(false)
  }

  const selectCategory = (key) => {
    const category = PostCategories.find(c => c.key === key)
    if (!category) {
      return
    }
    return category.title
  }

  const getUpdatedPost = async (id) => {
    await bindUpdatedPost(currentUser, 'id', { id })
    await getId('posts', id)
  }

  const deletePost = async (post, idx) => {
    if (displayPost.id && window.confirm('Are you sure to delete this post?')) {
      let result
      if (displayPost.stories.length === 1) {
        result = await remove('posts', displayPost.id)
      } else {
        if (post.fileUrl) {
          await removeFile(post.fileUrl)
        }
        displayPost.stories.splice(idx, 1)
        result = await update('posts', displayPost.id, { stories: displayPost.stories })
        setDisplayPost(displayPost)
      }
      /* Log the activity */
      await add('logs', {
        text: `${currentUser.displayName} removed the post`,
        photoURL: currentUser.photoURL,
        receiverId: '',
        userId: currentUser.id,
        actionType: 'delete',
        collection: 'posts',
        actionId: displayPost.id,
        actionKey: 'id',
        actionLink: '/app/profile/' + currentUser.id,
        timestamp
      })
      setResult(result)
      setHidePost(true)
      // await bindPosts(currentUser)
    }
  }

  const sharePost = async () => {
    await bindSharePost(currentUser, 'id', { post })
    history.push('/app/posts/' + displayPost.id)
  }

  const redirectToProfile = async () => {
    if (!hideRedirects) {
      history.push('/app/profile/' + displayPost.userId)
    }
  }

  const editPost = (post, idx) => {
    if (displayPost.id) {
      history.push({
        pathname: '/app/create_post',
        state: {
          sharePost: displayPost,
          story: post,
          storyIdx: idx
        }
      })
    }
  }

  const slideTo = (action, idx) => {
    const totalSlides = displayPost.stories.length
    if (action === 'prev') {
      if (idx === 0) {
        setActiveIndex(totalSlides - 1)
      } else {
        setActiveIndex(idx - 1)
      }
    } else {
      if (idx === totalSlides - 1) {
        setActiveIndex(0)
      } else {
        setActiveIndex(idx + 1)
      }
    }
  }

  const playAudio = (idx) => {
    const audio = document.getElementById(`audio-player-${displayPost.id}-${idx}`)
    const duration = parseInt(audio.duration)
    let currentTime = parseInt(audio.currentTime)

    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }

    const interval = setInterval(() => {
      currentTime = parseInt(audio.currentTime)
      setPlayDetails({ currentTime, duration })
      if (currentTime >= duration) {
        clearInterval(interval)
        setPlay(prev => { return true })
      }
    }, 1000)

    setPlayDetails({ currentTime, duration })
    setPlay(prevState => {
      return !prevState
    })
  }

  const copyLink = () => {
    navigator.clipboard.writeText(displayPostUrl)
  }

  return !hidePost && postedUser && displayPost.stories && (
    <div className='row mx-2 my-3'>
      <div className='col-2 col-sm-1 p-0 m-0'>
        {displayPost.anonymous
          ? <CustomImageComponent user={postedUser} size='sm' />
          : <CustomImageComponent user={postedUser} size='sm' />
        }
        <span className='created-at'>{moment(displayPost.createdAt).format('HH:mm')}</span>
      </div>
      <div className='card col-10 col-sm-11 m-0 post-card-wrapper'>
        {
          result.status && <NotificationComponent result={result} setResult={setResult} />
        }
        <ReportPostComponent postId={displayPost.id} currentUser={currentUser} collection='posts' />
        {
          (displayPost.premium && !purchaseFound && (currentUser.id !== displayPost.userId))
            ? <div className='card-body'>
            <div className='blur-post'>
              This post is locked. <br/> To unlock this post, purchase premium of the profile user.
            </div>
            <Link to={`/app/profile/${displayPost.userId}/unlock_profile`} className='unlock-post d-flex'>
              <i className='fa fa-lock'></i> &nbsp; Premium post. Unlock now
            </Link>
          </div>
            : <div>
              {
              displayPost.stories.map((story, idx) => (
                <div key={idx}>
                  <div className={`card-body ${idx !== activeIndex && 'd-none'}`}>
                    <div>
                      <span className='card-badge'>{selectCategory(displayPost.category.key)}</span>
                    </div>
                    <p className='card-text white-space-preline'>
                      {story.text.length <= 150 || displayFullStory
                        ? story.text
                        : <span className='pointer' onClick={e => setDisplayFullStory(!displayFullStory)}>{story.text.slice(0, 149)} <small>. . . See full story</small></span>
                      }
                    </p>
                    { story.fileUrl &&
                      <div className='d-flex align-items-center'>
                        <audio className='d-none' id={`audio-player-${displayPost.id}-${idx}`} src={story.fileUrl} controls controlsList='nodownload' />
                        <button className='audio-btn' onClick={e => playAudio(idx)}><i className={`fa fa-${play ? 'play' : 'pause'}`}></i></button>{playDetails && <small className='audio-details'>{playDetails.currentTime} / {playDetails.duration}</small>}
                      </div>
                    }
                    {
                      displayPost.stories.length > 1 &&
                      <div className='carousel-effect'>
                        <span className='prev' onClick={e => slideTo('prev', idx)}>Prev</span>
                        <span className='next' onClick={e => slideTo('next', idx)}>Next</span>
                      </div>
                    }
                    <div className='clearfix my-3'></div>
                  </div>
                  <div className='media card-footer card-details'>
                    <div className='media-body'>
                      <h6>
                        {displayPost.anonymous ? <span>@Anonymous</span> : <span className='pointer' onClick={e => redirectToProfile()}>@{postedUser.username}</span>}
                        <div className='edit-options'>
                          {followerLoading
                            ? <i className='fa fa-spinner fa-spin'></i>
                            : <button className='btn btn-link p-0 pr-1' onClick={e => followPost(e)}>
                              {
                                follower
                                  ? <img className="icon-heart" src={require('assets/svgs/HeartActive.svg').default} alt="1" />
                                  : <img className="icon-heart" src={require('assets/svgs/Heart.svg').default} alt="1" />
                              }
                            </button>
                          }
                          <div className='btn-group'>
                            <button className='btn btn-link btn-sm fs-15 text-secondary' id='shareMenuDropdown' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                              <img className="icon-share" src={require('assets/svgs/ShareBtn.svg').default} alt="1" />
                            </button>
                            <div className='dropdown-menu' aria-labelledby='shareMenuDropdown'>
                              <button className='dropdown-item' onClick={sharePost}>
                                Reshare
                              </button>
                              <button className='dropdown-item' onClick={copyLink}>
                                Send to...
                              </button>
                            </div>
                          </div>
                          <div className='btn-group'>
                            <button className='btn btn-link btn-sm ml-2 fs-15 text-secondary' id='optionsMenuDropdown' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                              <img className="icon-more" src={require('assets/svgs/ShowMore.svg').default} alt="1" />
                            </button>
                            <div className='dropdown-menu' aria-labelledby='optionsMenuDropdown'>
                              <button className='dropdown-item' onClick={sharePost}>
                                Share to...
                              </button>
                              <button className='dropdown-item' onClick={copyLink}>
                                Copy link
                              </button>
                              <button className={`dropdown-item ${(displayPost.userId !== currentUser.id) && 'd-none'}`} onClick={e => editPost(story, idx)}>
                                Edit
                              </button>
                              <button className={`dropdown-item ${(displayPost.userId !== currentUser.id) && 'd-none'}`} onClick={e => deletePost(story, idx)}>
                                Delete
                              </button>
                              <button className={`dropdown-item ${(displayPost.userId === currentUser.id) && 'd-none'}`} data-toggle='modal' data-target='#reportPostModal'>
                                Report
                              </button>
                            </div>
                          </div>
                        </div>
                      </h6>
                      <span className='created-at'>
                        {moment(displayPost.createdAt).format('DD MMMM YYYY')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        }
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
)(PostComponent)
