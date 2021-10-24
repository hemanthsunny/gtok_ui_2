import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import './style.css'

import HeaderComponent from './header'
import { update } from 'firebase_config'
import { SetUser, SetLoggedIn, SetDbUser, SetWallet } from 'store/actions'

function SettingsComponent ({ currentUser, wallet, bindLoggedIn, bindUser, bindDbUser, bindWallet }) {
  const [selectedWallet, setSelectedWallet] = useState(wallet && wallet[0])
  const [freezeWallet, setFreezeWallet] = useState(wallet && wallet[0] && wallet[0].freezeWallet)

  const handleFreezeWallet = async () => {
    if (!selectedWallet) {
      toast.error('No wallet found')
      setSelectedWallet('')
      return
    }

    const res = await update('wallets', selectedWallet.id, { freezeWallet: !freezeWallet })
    setFreezeWallet(!freezeWallet)

    if (res.status === 200 && !freezeWallet) {
      toast.success('Zena freezed your wallet.')
    } else if (res.status === 200 && freezeWallet) {
      toast.success('Zena unfreezed your wallet.')
    } else {
      toast.error(res.message)
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
                <li className={!selectedWallet && 'd-none'}>
                  <div className='d-flex flex-row align-items-center justify-content-between'>
                    <span className='option-name' htmlFor="freezeWallet">Freeze wallet</span>
                    <div className="custom-control custom-switch">
                      <input type="checkbox" className="custom-control-input" id="freezeWallet" onChange={handleFreezeWallet} checked={freezeWallet} />
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

const mapStateToProps = (state) => {
  const { wallet } = state.wallet
  return { wallet }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindLoggedIn: (content) => dispatch(SetLoggedIn(content)),
    bindUser: (content) => dispatch(SetUser(content)),
    bindDbUser: (content) => dispatch(SetDbUser(content)),
    bindWallet: (content) => dispatch(SetWallet(content))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsComponent)
