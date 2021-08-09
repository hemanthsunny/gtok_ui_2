import React from 'react'
import { connect } from 'react-redux'

function OtpComponent ({ currentUser, wallet, passcodeState, setPasscodeState }) {
  const handleChange = (key, val) => {
    setPasscodeState({ ...passcodeState, [key]: val })
  }

  const handleUpdate = () => {

  }

  return (
    <div className='change-pc-wrapper desktop-align-center'>
      <div className='text-center my-4'>
        <img src={require('assets/svgs/StepTwo.svg').default} className='' alt='Visibility' />
      </div>
      <p className='text-center'>
      Otp will be sent on your registered email id
      </p>
      <div className='form-group'>
        <label className='form-label'>Otp will be sent on your registered email id</label>
        <input type='number' className='form-control' id='confirmPc' maxLength='4' onChange={e => handleChange('confirmPc', e.target.value)} placeholder='xxxx' value={passcodeState.confirmPasscode}/>
      </div>
      <button className='btn btn-violet' onClick={handleUpdate}>
        Send OTP
      </button>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { wallet } = state.wallet
  return { wallet }
}

export default connect(
  mapStateToProps,
  null
)(OtpComponent)
