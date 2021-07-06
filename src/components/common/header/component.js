import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './style.css'

const HeaderComponent = ({
  newMessagesCount,
  newAlertsCount,
  pendingRelationsCount
}) => {
  return (
    <nav className='navbar fixed-top navbar-violet'>
      <div className='container-fluid p-0'>
        <div className='navbar-brand mr-auto'>
          <Link to='/app/posts'>
            <img src={require('assets/svgs/Logo.svg').default} className='icon-logo' alt='Filters' />
          </Link>
        </div>
        <ul className='navbar-nav ml-auto'>
          <li className='nav-item'>
            <div className='nav-link p-0'>
              <Link to='/app/create_post' className={`${window.innerWidth < 576 && 'd-none'}`} title='Create'>
                <img src={require('assets/svgs/Plus.svg').default} className='icon-post' alt='Chats' />
                {(newMessagesCount > 0) && <sup><img src={require('assets/svgs/DotActive.svg').default} className='dot-chat-icon' alt='Dot' /></sup>}
              </Link>
              <Link to='/app/posts' className={`${window.innerWidth < 576 && 'd-none'}`} title='Home'>
                <img src={require('assets/svgs/HomeWhite.svg').default} className='icon-home' alt='Home' />
              </Link>
              <Link to='/app/search' title='Search'>
                <img src={require('assets/svgs/Search.svg').default} className='icon-search' alt='Search' />
              </Link>
              <Link to='/app/chats' title='Chat'>
                <img src={require('assets/svgs/Chat.svg').default} className='icon-chat' alt='Chats' />
                {(newMessagesCount > 0) && <sup><img src={require('assets/svgs/DotActive.svg').default} className='dot-chat-icon' alt='Dot' /></sup>}
              </Link>
              <Link to='/app/alerts' title='Alerts'>
                <img src={require('assets/svgs/Bell.svg').default} className='icon-alert' alt='Alerts' />
                {(pendingRelationsCount > 0 || newAlertsCount > 0) && <sup><img src={require('assets/svgs/DotActive.svg').default} className='dot-alert-icon' alt='Dot' /></sup>}
              </Link>
              <Link to='/app/profile' className={`${window.innerWidth < 576 && 'd-none'}`} title='Profile'>
                <img src={require('assets/svgs/ProfileWhite.svg').default} className='icon-profile' alt='Profile' />
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  )
}

const mapStateToProps = (state) => {
  const { newAlertsCount } = state.alerts
  const { newMessagesCount } = state.chatMessages
  const { pendingRelationsCount } = state.relationships
  return { newAlertsCount, newMessagesCount, pendingRelationsCount }
}

export default connect(
  mapStateToProps,
  null
)(HeaderComponent)
