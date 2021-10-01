import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const HeaderComponent = ({ newMessagesCount, newAlertsCount, pendingRelationsCount, save, loading, sharePost }) => {
  return (
    <nav className='navbar fixed-top fixed-top-lg navbar-violet-md px-4'>
      <Link to='/'>
        <img src={require('assets/svgs/Cross.svg').default} className='cross-icon' alt='LeftArrow' />
      </Link>
      <div className='navbar-brand mr-auto pt-2'>
        &nbsp; &nbsp; {sharePost.id ? 'Edit' : 'Create'} asset
      </div>
      <ul className='navbar-nav ml-auto'>
        <li className='nav-item'>
          <div className='nav-link p-0 text-white fw-500'>
            {
              loading
                ? <div className='spinner-border spinner-border-sm' role='status'>
                  <span className='sr-only'>Loading...</span>
                </div>
                : <span onClick={e => save()}>{sharePost.id ? 'Update' : 'Share'}</span>
            }
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
