import React from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

const HeaderComponent = ({ newMessagesCount, newAlertsCount, pendingRelationsCount, save }) => {
  const history = useHistory()

  return (
    <nav className='navbar fixed-top navbar-violet-md px-4'>
      <div className='' onClick={e => history.push('/app/settings')}>
        <img src={require('assets/svgs/LeftArrowWhite.svg').default} className='go-back-icon' alt='LeftArrow' />
      </div>
      <div className='navbar-brand mr-auto pt-2'>
        Wallet settings
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

// https://github.com/dannyradden/single-character-input-boxes
