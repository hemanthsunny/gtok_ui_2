import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const HeaderComponent = ({
  newMessagesCount,
  newAlertsCount,
  pendingRelationsCount
}) => {
  return (
    <nav className='navbar fixed-top header'>
      <div className='container-fluid'>
        <div className='navbar-brand mr-auto'>
          <Link to='/app/posts'>
            <span className='home-page-title'>Lets Gtok</span>
          </Link>
        </div>
        <ul className='navbar-nav ml-auto'>
          <li className='nav-item'>
            <div className='nav-link p-0'>
              <Link to='/app/search' title='Search'>
                Search
                {(pendingRelationsCount > 0) && <sup><img src={require('assets/svgs/DotActive.svg').default} className={'dot-icon'} alt='Dot' /></sup>}
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
