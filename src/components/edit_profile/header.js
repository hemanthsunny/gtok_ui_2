import React from 'react'
import { Link } from 'react-router-dom'

const HeaderComponent = ({ newMessagesCount, newAlertsCount }) => {
  return (window.innerWidth > 576)
    ? (
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
    </nav>)
    : (
    <nav className='navbar fixed-top header'>
      <Link to='/app/settings'>
        <img src={require('assets/svgs/LeftArrow.svg').default} className='go-back-icon' alt='LeftArrow' />
      </Link>
      <div className='navbar-brand mr-auto fs-18'>
        Edit profile
      </div>
      <ul className='navbar-nav ml-auto'>
        <li className='nav-item'>
          <div className='nav-link p-0 d-none'>
            <Link to='/app/settings/change_password' title='Permission'>
              <img src={require('assets/svgs/Save.svg').default} className='save-icon' alt='Save' />
            </Link>
          </div>
        </li>
      </ul>
    </nav>
      )
}

export default HeaderComponent
