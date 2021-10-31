import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const HeaderComponent = ({
  newMessagesCount,
  newAlertsCount,
  pendingRelationsCount
}) => {
  return (
    <nav className='navbar fixed-top navbar-violet d-sm-none'>
      <div className='container-fluid p-0'>
        <div className='navbar-brand mr-auto'>
          <Link to='/app/assets'>
            <img src={require('assets/svgs/Logo.svg').default} className='icon-logo' alt='Filters' />
          </Link>
        </div>
        <ul className='navbar-nav ml-auto'>
          <li className='nav-item'>
            <div className='nav-link p-0'>
              <Link to='/app/search' title='Search'>
                <img src={require('assets/svgs/Search.svg').default} className='icon-search' alt='Search' />
              </Link>
              <Link to='/app/chats' className='chat-active' title='Chat'>
                <img src={require('assets/svgs/ChatActive.svg').default} className='icon-chat' alt='Chats' />
                {(newMessagesCount > 0) && <sup><img src={require('assets/svgs/DotActive.svg').default} className='dot-chat-icon' alt='Dot' /></sup>}
              </Link>
              <Link to='/app/alerts' title='Alerts'>
                <img src={require('assets/svgs/Bell.svg').default} className='icon-alert' alt='Alerts' />
                {(pendingRelationsCount > 0 || newAlertsCount > 0) && <sup><img src={require('assets/svgs/DotActive.svg').default} className='dot-alert-icon' alt='Dot' /></sup>}
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
