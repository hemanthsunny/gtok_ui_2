import React from 'react'
import { Link } from 'react-router-dom'

const HeaderComponent = ({ userId, currentUserId, newMessagesCount, newAlertsCount }) => {
  return (
    <nav className='navbar fixed-top header'>
      <div className='container-fluid'>
        <div className='navbar-brand mr-auto'>
          <Link to='/app/posts'>
            <span className='home-page-title'>LetsGtok</span>
          </Link>
        </div>
        <ul className='navbar-nav ml-auto'>
          <li className='nav-item'>
            <div className='nav-link p-0'>
              <Link to='/app/search' title='Search'>
                Search
              </Link>
              <Link to='/app/chats' title='Notifications'>
                Notifications
                {(newMessagesCount > 0 || newAlertsCount > 0) && <sup><img src={require('assets/svgs/DotActive.svg').default} className={'dot-icon'} alt='Dot' /></sup>}
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default HeaderComponent
