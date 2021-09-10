import React from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import $ from 'jquery'
import './style.css'

const ShareOptionsComponent = ({ currentUser, sharePost, sharePost: displayPost }) => {
  const history = useHistory()

  const resharePost = async (post, idx) => {
    if (displayPost.id) {
      history.push({
        pathname: '/app/reshare_post',
        state: {
          sharePost
        }
      })
    }
    await closeModal()
  }

  const closeModal = () => {
    $('#shareOptionsModal').hide()
    $('.modal-backdrop').remove()
    $('body').removeClass('modal-open')
    // $('.modal-open').remove()
  }

  return (
    <div className='modal fade' id='shareOptionsModal' tabIndex='-1' role='dialog' aria-labelledby='shareOptionsModalLabel' aria-hidden='true'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-body p-0'>
            <div className='text-center'>
              <img className='btn-play' src={require('assets/svgs/Accessibility.svg').default} alt='1' />
            </div>
            <ul className='menu-list'>
              <li className={`menu-item ${(displayPost.userId === currentUser.id) && 'd-none'}`} onClick={e => resharePost()}>
                Reshare
              </li>
              <li className='menu-item' data-toggle='modal' data-target='#createChatModal' onClick={e => closeModal()}>Send to...</li>
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
)(ShareOptionsComponent)
