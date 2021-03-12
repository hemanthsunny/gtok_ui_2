import React from 'react'
import { Link } from 'react-router-dom'

const MessageHeaderComponent = (props) => {
  return (
    <nav className='navbar fixed-top navbar-expand-sm py-md-0'>
      <Link to='/app/posts'>
        <img src={require('assets/svgs/LeftArrow.svg').default} className='go-back-icon' alt='LeftArrow' />
      </Link>
      <div className='navbar-brand mr-auto fs-18'>
        Messages
      </div>
      <ul className='navbar-nav ml-auto d-none'>
        <li className='nav-item'>
          <div className='nav-link p-0'>
            <Link to='/app/profile' title='Alert Settings'>
              <img src={require('assets/svgs/VerticalMenuDots.svg').default} className='go-back-icon' alt='Menu' />
            </Link>
          </div>
        </li>
      </ul>
    </nav>
  )
}

export default MessageHeaderComponent
