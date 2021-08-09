import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const HeaderComponent = ({ save, loading, wallet }) => {
  return (
    <nav className='navbar fixed-top navbar-violet-md px-4'>
      <Link to='/app/wallet_settings'>
        <img src={require('assets/svgs/Cross.svg').default} className='cross-icon' alt='LeftArrow' />
      </Link>
      <div className='navbar-brand mr-auto pt-2'>
        &nbsp; &nbsp; {wallet.length < 1 ? 'Create' : 'Change'} passcode
      </div>
      <ul className='navbar-nav ml-auto'>
        <li className='nav-item'>
          <div className='nav-link p-0 text-white fw-500' onClick={save}>
            {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Update'}
          </div>
        </li>
      </ul>
    </nav>
  )
}

const mapStateToProps = (state) => {
  const { wallet } = state.wallet
  return { wallet }
}

export default connect(
  mapStateToProps,
  null
)(HeaderComponent)
