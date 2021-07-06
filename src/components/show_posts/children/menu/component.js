import React, { useEffect } from 'react'
// import $ from 'jquery'
import './style.css'

function MenuOptions ({ displayPost, currentUser, sharePost, copyLink, editPost, deletePost }) {
  useEffect(() => {
    // $('#MenuOptionsModal').appendTo('body')
  })

  const copyLinks = () => {
    // navigator.clipboard.writeText(displayPostUrl)
    alert('link copied')
  }

  return (
    <div className='model'>
      <div className='content'>
        <div className='body pt-0'>
          <div className='text-center pb-2'>
            <img className='btn-play' src={require('assets/svgs/Accessibility.svg').default} alt="1" />
          </div>
          <ul className='menu-list'>
            <li className='menu-item' onClick={sharePost}>Share to...</li>
            <li className='menu-item' onClick={copyLinks}>Copy link</li>
            <li className={`menu-item ${(displayPost.userId === currentUser.id) && 'd-none'}`}>Report</li>
            <li className={`menu-item ${(displayPost.userId !== currentUser.id) && 'd-none'}`} onClick={e => editPost()}>Edit</li>
            <li className={`menu-item ${(displayPost.userId !== currentUser.id) && 'd-none'}`} onClick={deletePost}>Delete</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MenuOptions
