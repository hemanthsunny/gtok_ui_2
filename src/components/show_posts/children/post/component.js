import React, { useState, useEffect, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import $ from 'jquery'
import './style.css'
import SliderComponent from '../slider/component'
import MenuModalComponent from '../menu_modal/component'
import ShareModalComponent from '../share_modal/component'

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
import { NotificationComponent, CustomImageComponent } from 'components'

const PostComponent = ({
  currentUser, post, bindPosts, hideSimilarityBtn = false, bindSharePost, hideShareBtn = false, hideRedirects = false, allUsers, bindUpdatedPost, purchaseOrders
}) => {
  const [displayPost, setDisplayPost] = useState(post)
  const [postedUser, setPostedUser] = useState('')
  const [follower, setFollower] = useState(!!displayPost.followers.find(f => f === currentUser.id))
  const [result, setResult] = useState({})
  const [activeIndex, setActiveIndex] = useState(0)
  const [play, setPlay] = useState(true)
  const [playDetails, setPlayDetails] = useState({ currentTime: 0, duration: 0 })
  const [displayFullStory, setDisplayFullStory] = useState(false)
  const [hidePost, setHidePost] = useState(false)

  const purchaseFound = purchaseOrders.find(order => (order.profileUserId === displayPost.userId && order.active))
  const history = useHistory()
  const displayPostUrl = 'https://app.letsgtok.com/app/posts/' + displayPost.id
  const audioRef = useRef()

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
    if (!follower) {
      $(`.icon-heart-${displayPost.id}`).addClass('scaleInImgFollow')
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
      $(`.icon-heart-${displayPost.id}`).addClass('scaleInImgUnfollow')
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
    setTimeout(() => {
      $(`.icon-heart-${displayPost.id}`).removeClass('scaleInImgFollow')
      $(`.icon-heart-${displayPost.id}`).removeClass('scaleInImgUnfollow')
    }, 2000)
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
      setPlayDetails({
        currentTime,
        duration,
        progressPercent: parseFloat((currentTime / duration) * 100).toFixed(2)
      })
      if (currentTime >= duration) {
        clearInterval(interval)
        setPlay(prev => { return true })
      }
    }, 1000)

    setPlayDetails({
      currentTime,
      duration,
      progressPercent: parseFloat((currentTime / duration) * 100).toFixed(2)
    })
    setPlay(prevState => {
      return !prevState
    })
  }

  const onChangeAudio = (e) => {
    const audio = audioRef.current
    audio.currentTime = (audio.duration / 100) * e.target.value
    setPlayDetails({ ...playDetails, progressPercent: e.target.value })
  }

  const copyLink = () => {
    navigator.clipboard.writeText(displayPostUrl)
    alert('link copied')
  }

  return !hidePost && postedUser && displayPost.stories && (
    <div className='d-flex ml-2 mt-3 mb-4'>
      <div className=''>
        {displayPost.anonymous
          ? <CustomImageComponent user={postedUser} size='sm' />
          : <CustomImageComponent user={postedUser} size='sm' />
        }
      </div>
      <div className='card post-card-wrapper'>
        {
          result.status && <NotificationComponent result={result} setResult={setResult} />
        }
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
                      <span className='card-badge'>{displayPost.category.title}</span>
                      <span className='created-at'>{moment(displayPost.createdAt).format('h:mm A')} &middot; {moment(displayPost.createdAt).format('MMMM DD, YYYY')}</span>
                    </div>
                    <div className='clearfix'></div>
                    <p className='card-text white-space-preline' onClick={e => followPost(e)}>
                      {story.text.length <= 150 || displayFullStory
                        ? story.text
                        : <span className='pointer' onClick={e => setDisplayFullStory(!displayFullStory)}>{story.text.slice(0, 149)} <small>. . . See full story</small></span>
                      }
                    </p>
                    { story.fileUrl &&
                      <div className='audio-player-wrapper'>
                        <audio className='d-none' id={`audio-player-${displayPost.id}-${idx}`} src={story.fileUrl} controls controlsList='nodownload' ref={audioRef} />
                        <div className='audio-btn' onClick={e => playAudio(idx)}>
                          <button className='btn'>
                            { play
                              ? <img className='btn-play' src={require('assets/svgs/Play.svg').default} alt="1" />
                              : <img className='btn-pause' src={require('assets/svgs/Pause.svg').default} alt="1" />
                            }
                          </button>
                        </div>
                        <div className='audio-time'>
                          {playDetails && <span className='current'>{moment.utc(playDetails.currentTime * 1000).format('mm:ss')}</span>}
                          {playDetails && <span className='duration'>{moment.utc(playDetails.duration * 1000).format('mm:ss')}</span>}
                        </div>
                        <SliderComponent playDetails={playDetails} onChange={onChangeAudio} />
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
                  <div className='card-footer'>
                    {displayPost.anonymous ? <span className='author'>@Anonymous</span> : <span className='author pointer' onClick={e => redirectToProfile()}>@{postedUser.username}</span>}
                    <div className='edit-options'>
                        <button className='btn btn-link btn-heart pr-0' onClick={e => followPost(e)}>
                          {
                            follower
                              ? <img className={`icon-heart icon-heart-${displayPost.id}`} src={require('assets/svgs/HeartActive.svg').default} alt="1" />
                              : <img className={`icon-heart icon-heart-${displayPost.id}`} src={require('assets/svgs/Heart.svg').default} alt="1" />
                          }
                        </button>
                        <button className='btn btn-link' data-toggle='modal' data-target='#ShareOptionsModal'>
                          <img className="icon-share" src={require('assets/svgs/ShareBtn.svg').default} alt="1" />
                        </button>
                        <ShareModalComponent displayPost={displayPost} currentUser={currentUser} />
                        <button className='btn btn-link' data-toggle='modal' data-target='#MenuModal'>
                          <img className="icon-more" src={require('assets/svgs/ShowMore.svg').default} alt="1" />
                        </button>
                        <MenuModalComponent displayPost={displayPost} currentUser={currentUser} sharePost={sharePost} copyLink={copyLink} editPost={editPost} deletePost={deletePost} />

                        <div className='btn-group'>
                          <div className='dropdown-menu' aria-labelledby='shareMenuDropdown'>
                            <button className='dropdown-item' onClick={sharePost}>
                              Reshare
                            </button>
                            <button className='dropdown-item' onClick={copyLink}>
                              Send to...
                            </button>
                          </div>
                        </div>
                        <div className='btn-group d-none'>
                          <button className='btn btn-link btn-sm btn-more' id='optionsMenuDropdown' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
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
