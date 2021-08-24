import React, { useState } from 'react'

function ConfirmComponent ({ wallet, currentUser, save, displayPost }) {
  const [passcode, setPasscode] = useState('')

  return (
    <div className='container desktop-align-center trade-post-wrapper'>
      <div className='pt-3'>
        <img src={require('assets/svgs/StepTwo.svg').default} className='' alt='Visibility' />
      </div>
      <h5 className='pt-5'>Enter wallet passcode</h5>
      <div className='enter-passcode-section'>
        <div className='passcode-card'>
          <input type='password' className='passcode-input' placeholder='....' onChange={e => setPasscode(e.target.value)} maxLength='4' />
        </div>
        <button className='btn btn-violet-rounded btn-sm col-5 submit-passcode' disabled={passcode.length !== 4} onClick={save}>Pay <img src={require('assets/svgs/currency/inr.svg').default} className='inr-black-icon' alt='Inr' /> {displayPost.tradePrice} </button>
      </div>
    </div>
  )
}

export default ConfirmComponent
