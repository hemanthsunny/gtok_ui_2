import React, { useEffect } from 'react'
import $ from 'jquery'

function MenuModal ({ displayPost, currentUser, sharePost, editPost, deletePost }) {
  useEffect(() => {
    $('#MenuModal').appendTo('body')
  })

  const copyLink = () => {
    // navigator.clipboard.writeText(displayPostUrl)
    alert('link copied')
  }

  return (
    <div className='modal fade' tabIndex='-1' role='dialog' id='MenuModal' aria-labelledby='MenuModalLabel'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-body pt-0'>
            <div className='text-center'>
              <img className='btn-play' src={require('assets/svgs/Accessibility.svg').default} alt='1' />
            </div>
            <ul className='menu-list'>
              <li className='menu-item' onClick={sharePost}>
                Share to...
              </li>
              <li className='menu-item' onClick={copyLink}>
                Copy link
              </li>
              <li className={`menu-item ${(displayPost.userId === currentUser.id) && 'd-none'}`}>Report</li>
              <li className={`menu-item ${(displayPost.userId !== currentUser.id) && 'd-none'}`} onClick={e => editPost()}>Edit</li>
              <li className={`menu-item ${(displayPost.userId !== currentUser.id) && 'd-none'}`} onClick={deletePost}>Delete</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuModal
