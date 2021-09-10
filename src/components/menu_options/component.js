import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import $ from 'jquery'
import './style.css'

import {
  add,
  update,
  remove,
  removeFile,
  timestamp
} from 'firebase_config'

const MenuOptionsComponent = ({ currentUser, sharePost, sharePost: displayPost }) => {
  const [copied, setCopied] = useState(false)
  const [popup, setPopup] = useState(false)
  const history = useHistory()

  const copyLink = () => {
    navigator.clipboard.writeText(`https://app.letsgtok.com/app/posts/${displayPost.id}`)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 5000)
  }

  const editPost = async (post, idx) => {
    await closeModal()
    history.push({
      pathname: '/app/create_post',
      state: {
        sharePost,
        story: sharePost.stories[0],
        storyIdx: idx || 0
      }
    })
  }

  const deletePost = async (post, idx) => {
    if (displayPost.tradePrice) {
      return
    }
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
      console.log('result', result)
      // await bindPosts(currentUser)
    }
    await closeModal()
  }

  const closeModal = () => {
    $('#menuOptionsModal').hide()
    $('.modal-backdrop').remove()
    $('body').removeClass('modal-open')
    // $('.modal-open').remove()
  }

  const shareTo = async () => {
    await closeModal()
    history.push({
      pathname: `/app/posts/${sharePost.id}`,
      state: {
        sharePost,
        story: sharePost.stories[0],
        storyIdx: 0
      }
    })
  }

  return (
    <div className='modal fade' id='menuOptionsModal' tabIndex='-1' role='dialog' aria-labelledby='menuOptionsModalLabel' aria-hidden='true'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-body p-0'>
            <div className='text-center'>
              <img className='btn-play' src={require('assets/svgs/Accessibility.svg').default} alt='1' />
            </div>
            <ul className='menu-list'>
              <li className='menu-item' onClick={e => shareTo()}>
                Share to...
              </li>
              <li className='menu-item' onClick={e => copyLink()}>
                Copy link <small className={`text-violet btn-sm pull-right fade-in ${!copied && 'd-none'}`}>Copied</small>
              </li>
              <li className={`menu-item ${(displayPost.userId === currentUser.id) && 'd-none'}`} data-toggle='modal' data-target='#reportPostModal' onClick={e => closeModal()}>Report</li>
              <li className={`menu-item ${(displayPost.userId !== currentUser.id) && 'd-none'}`} onClick={e => editPost()}>Edit</li>
              <li className={`menu-item ${(displayPost.userId !== currentUser.id) && 'd-none'} ${displayPost.tradePrice && 'btn-disabled'}`}>
                <span onClick={e => deletePost()}>Delete</span>
                {
                  popup &&
                  <div id='tooltip' role='tooltip'>d
                    Trading asset can't be deleted
                    <div id='arrow' data-popper-arrow></div>
                  </div>
                }
                <img className='info pull-right' src={require('assets/svgs/InfoViolet.svg').default} alt='1' onClick={e => setPopup(!popup)} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { sharePost } = state.posts
  return { sharePost }
}

export default connect(
  mapStateToProps,
  null
)(MenuOptionsComponent)
