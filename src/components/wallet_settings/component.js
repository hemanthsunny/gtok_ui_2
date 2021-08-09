import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './style.css'

import HeaderComponent from './header'
import { update } from 'firebase_config'
import { SetUser, SetLoggedIn, SetDbUser } from 'store/actions'

function SettingsComponent ({ currentUser, bindLoggedIn, bindUser, bindDbUser }) {
  const handleFreezeWallet = async () => {
    const res = await update('users', currentUser.id, { freezeWallet: !currentUser.freezeWallet })
    await bindDbUser({ ...currentUser, freezeWallet: !currentUser.freezeWallet })
    if (res.status !== 200) {
      alert('Successfully went wrong. Try later.')
    }
  }

  return (
    <div>
      <HeaderComponent />
      <div>
        <div className='dashboard-content'>
          <div className='container settings-wrapper desktop-align-center mt-5'>
            <div className='section'>
              <ul className='section-list'>
                <li>
                  <Link to='/app/change_passcode' className='d-flex flex-row align-items-center justify-content-between'>
                    <span className='option-name'>Change passcode</span>
                  </Link>
                </li>
                <li>
                  <div className='d-flex flex-row align-items-center justify-content-between'>
                    <span className='option-name' htmlFor="freezeWallet">Freeze wallet</span>
                    <div className="custom-control custom-switch">
                      <input type="checkbox" className="custom-control-input" id="freezeWallet" onChange={handleFreezeWallet} checked={currentUser.freezeWallet || false} />
                      <label className="custom-control-label" htmlFor="freezeWallet"></label>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindLoggedIn: (content) => dispatch(SetLoggedIn(content)),
    bindUser: (content) => dispatch(SetUser(content)),
    bindDbUser: (content) => dispatch(SetDbUser(content))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(SettingsComponent)
