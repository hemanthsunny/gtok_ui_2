import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import $ from 'jquery'
import './style.css'

import {
  add,
  arrayAdd,
  arrayRemove,
  getId,
  update,
  timestamp
} from 'firebase_config'
import { SetPosts, SetSharePost, SetUpdatedPost } from 'store/actions'
import { NotificationComponent, CustomImageComponent } from 'components'
import SliderComponent from '../slider/component'
import { convertTextToLink, hideCurrentYear } from 'helpers'

const PostComponent = ({
  currentUser, post, bindPosts, hideSimilarityBtn = false, bindSharePost, hideShareBtn = false, hideRedirects = false, allUsers, bindUpdatedPost, transactions, reshare = false, hideEditOptions, post: displayPost, wallet, handleFilters
}) => {
  const [postedUser, setPostedUser] = useState('')
  const [follower, setFollower] = useState(!!displayPost.followers.find(f => f === currentUser.id))
  const [result, setResult] = useState({})
  const [activeIndex, setActiveIndex] = useState(0)
  const [play, setPlay] = useState(true)
  const [playDetails, setPlayDetails] = useState({ currentTime: 0, duration: 0 })
  const [displayFullStory, setDisplayFullStory] = useState(false)

  const trans = transactions.find(trans => trans.userId === currentUser.id && trans.postId === displayPost.id)
  const history = useHistory()
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
      if (currentUser.id !== postedUser.id) {
        /* Log the activity */
        await add('logs', {
          text: `@${currentUser.username} pinched your asset`,
          photoURL: currentUser.photoURL,
          receiverId: postedUser.id,
          userId: currentUser.id,
          actionType: 'update',
          collection: 'posts',
          actionId: displayPost.id,
          actionKey: 'followers',
          actionLink: '/app/assets/' + displayPost.id,
          unread: true,
          timestamp
        })
      }
      setFollower(true)
    } else {
      $(`.icon-heart-${displayPost.id}`).addClass('scaleInImgUnfollow')
      await update('posts', displayPost.id, { followers: arrayRemove(currentUser.id), followersCount: displayPost.followers.length - 1 })
      /* Log the activity */
      await add('logs', {
        text: `${currentUser.displayName} removed pinch for your asset`,
        photoURL: currentUser.photoURL,
        receiverId: '',
        userId: currentUser.id,
        actionType: 'update',
        collection: 'posts',
        actionId: displayPost.id,
        actionKey: 'followers',
        actionLink: '/app/assets/' + displayPost.id,
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

  const sharePost = async (opt) => {
    if (opt === 'shareOptions') {
      localStorage.setItem('sharePostText', `Hey! I want to share this asset with you. Have a look ${process.env.REACT_APP_URL}app/posts/${post.id}`)
    }
    await bindSharePost(currentUser, 'id', { post })
    // history.push('/app/assets/' + displayPost.id)
  }

  const redirectToProfile = async () => {
    if (!hideRedirects) {
      history.push('/app/profile/' + postedUser.username)
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

  const tradePostAction = () => {
    if (!wallet.length) {
      history.push('/app/change_passcode')
    } else {
      history.push(`/app/trade/${displayPost.id}`)
    }
  }

  return postedUser && displayPost.stories && (
    <div className={`d-flex ${reshare ? 'm-0' : 'ml-2 mt-3 mb-4'}`}>
      <div className={`${reshare && 'd-none'}`}>
        {displayPost.anonymous
          ? <CustomImageComponent user={postedUser} size='sm' />
          : <CustomImageComponent user={postedUser} size='sm' />
        }
      </div>
      <div className={`card post-card-wrapper ${reshare ? 'reshare-box' : 'add-filter'}`}>
        {
          result.status && <NotificationComponent result={result} setResult={setResult} />
        }
        {
          displayPost.stories.map((story, idx) => (
            <div key={idx}>
              <div className={`card-body ${idx !== activeIndex && 'd-none'}`}>
                <div>
                  {
                    !post.resharePostId &&
                    <span className={`${reshare ? 'pull-left mr-2' : 'd-none'}`}>
                      {displayPost.anonymous
                        ? <CustomImageComponent user={postedUser} size='sm' />
                        : <CustomImageComponent user={postedUser} size='sm' />
                      }
                    </span>
                  }
                  {
                    displayPost.category
                      ? <span className='card-badge' onClick={e => handleFilters && handleFilters('selected', displayPost.category.title)}>{displayPost.category.title}</span>
                      : <span className='card-badge' onClick={e => handleFilters && handleFilters('selected', 'Same Pinch')}>Same Pinch</span>
                  }
                  <span className={`card-amount ${!displayPost.tradePrice && 'd-none'} pl-2`}>
                    <span className='currency-text'><img className='currency-icon' src={require('assets/svgs/currency/inr/inr_black.svg').default} alt="1" />{displayPost.tradePrice}</span>
                  </span>
                  <span className='created-at'>{moment(displayPost.createdAt).format('h:mm a')} &middot; {hideCurrentYear(displayPost.createdAt)}</span>
                </div>
                <div className='clearfix'></div>
                {
                  (displayPost.tradePrice && !trans && (currentUser.id !== displayPost.userId))
                    ? <div className='card-body hidden-post px-0'>
                      <div>
                        {story.text.substring(0, 15)}...
                        <span className='blur-text'>
                          This is a trading asset. Trade it, to unlock.
                        </span>
                      </div>
                      <div className='locked-post pointer' onClick={e => tradePostAction(displayPost.id)}>
                        <div className='locked-post-text'>
                          Unlock for <span className='currency-text'><img className='currency-icon' src={require('assets/svgs/currency/inr_violet.svg').default} alt="1" />{displayPost.tradePrice}</span>
                        </div>
                        <div>
                          <img src={require('assets/svgs/LockedPost.svg').default} className='locked-post-icon' alt="1" />
                        </div>
                      </div>
                    </div>
                    : <div>
                      <p className='card-text white-space-preline'>
                        {story.text.length <= 150 || displayFullStory
                          ? convertTextToLink(story.text)
                          : <span className='pointer' onClick={e => setDisplayFullStory(!displayFullStory)}>{convertTextToLink(story.text.slice(0, 149))} <small>. . . See full story</small></span>
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
              }
              </div>
              <div className='card-footer'>
                {displayPost.anonymous ? <span className='author'>@anonymous</span> : <span className='author pointer' onClick={redirectToProfile}>@{postedUser.username}</span>}
                <div className={`edit-options ${hideEditOptions && 'd-none'}`}>
                  <button className='btn btn-link btn-heart pr-0' onClick={e => followPost(e)}>
                    {
                      follower
                        ? <img className={`icon-heart icon-heart-${displayPost.id}`} src={require('assets/svgs/PinchActive.svg').default} alt="1" />
                        : <img className={`icon-heart icon-heart-${displayPost.id}`} src={require('assets/svgs/Pinch.svg').default} alt="1" />
                    }
                  </button>
                  <button className='btn btn-link' data-toggle='modal' data-target='#shareOptionsModal' onClick={e => sharePost('shareOptions')}>
                    <img className="icon-share" src={require('assets/svgs/ShareBtn.svg').default} alt="1" />
                  </button>
                  <button className='btn btn-link' data-toggle='modal' data-target='#menuOptionsModal' onClick={e => sharePost('menuOptions')}>
                    <img className="icon-more" src={require('assets/svgs/ShowMore.svg').default} alt="1" />
                  </button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { allUsers } = state.users
  const { transactions } = state.transactions
  const { wallet } = state.wallet
  return { allUsers, transactions, wallet }
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
