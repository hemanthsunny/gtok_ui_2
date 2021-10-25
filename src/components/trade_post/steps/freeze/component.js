import React from 'react'
import { Link } from 'react-router-dom'

function FreezeComponent ({ currentUser }) {
  return (
    <div className='container desktop-align-center trade-post-wrapper mt-5 mt-sm-0'>
      Unfreeze your wallet to trade assets. <br />
      <Link to='/app/wallet_settings' className='btn btn-violet-rounded btn-sm col-3 submit-passcode mt-3'>
        Unfreeze
      </Link>
    </div>
  )
}

export default FreezeComponent
