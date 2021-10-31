import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const HeaderComponent = ({
  newMessagesCount,
  newAlertsCount,
  pendingRelationsCount,
  currentUser
}) => {
  return (
    <nav className={`navbar fixed-top navbar-violet ${window.innerWidth > 576 && 'd-none'}`}>
      <div className='container-fluid p-0'>
        <div className='navbar-brand d-flex'>
          <Link to='/app/assets'>
            <img src={require('assets/svgs/LeftArrowWhite.svg').default} className='icon-logo' alt='Filters' />
          </Link>
          <Link to='/app/profile' className='flex-grow-1'>
            @{currentUser && currentUser.username}
          </Link>
          <Link to='/'>
            <img src={require('assets/svgs/Settings.svg').default} className='icon-logo' alt='Filters' />
          </Link>
        </div>
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
