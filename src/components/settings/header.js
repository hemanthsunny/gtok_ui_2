import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const HeaderComponent = ({ newMessagesCount, newAlertsCount, pendingRelationsCount, save }) => {
  return (
    <nav className='navbar fixed-top navbar-violet-md px-4'>
      <Link to='/app/profile'>
        <img src={require('assets/svgs/LeftArrowWhite.svg').default} className='go-back-icon' alt='LeftArrow' />
      </Link>
      <div className='navbar-brand mr-auto pt-2'>
        Settings
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
