import React, { useEffect } from 'react'
import $ from 'jquery'
import './style.css'

function ShareOptions ({ displayPost, currentUser }) {
  useEffect(() => {
    $('#ShareOptionsModal').appendTo('body')
  })

  return (
    <div className='modal fade' tabIndex='1' role='dialog' id='ShareOptionsModal' aria-labelledby='ShareOptionsModalLabel'>
      <div className='modal-dialog' role='document'>
        <div className='modal-content'>
          <div className='modal-body pt-0'>
            <div className='text-center pb-2'>
              <img className='btn-play' src={require('assets/svgs/Accessibility.svg').default} alt="1" />
            </div>
            <ul className='menu-list'>
              <li className='menu-item'>Reshare</li>
              <li className='menu-item'>Send to...</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareOptions
