import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { getQuery, firestore, update } from 'firebase_config'

function OtpComponent ({ currentUser, passcodeState, setPasscodeState }) {
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const history = useHistory()

  const getWallet = async () => {
    const wallet = await getQuery(
      firestore.collection('wallets').where('userId', '==', currentUser.id).get()
    )
    return wallet[0]
  }

  const sendOtp = async () => {
    const w = await getWallet()
    const res = await update('wallets', w.id, { otp: 1234 })
    if (res.status === 200) {
      await getWallet()
      setOtpSent(true)
    } else {
      alert('Something went wrong. Try again later!')
    }
  }

  const handleChange = async (val) => {
    setOtp(val)
    if (val.length === 4) {
      await verifyOtp(val)
    }
  }

  const verifyOtp = async (val) => {
    const w = await getWallet()
    if (w.otp === +val) {
      const res = await update('wallets', w.id, { otp: null, verified: true })
      if (res.status === 200 && window.confirm('Passcode verified successfully')) {
        history.push('/app/wallet')
      }
    } else {
      alert('Otp is wrong. Please try again!')
    }
  }

  return (
    <div className='change-pc-wrapper desktop-align-center text-center'>
      <div className='my-4'>
        <img src={require('assets/svgs/StepTwo.svg').default} className='' alt='Visibility' />
      </div>
      <p className='otp-message'>
      OTP will be sent on your registered email id
      </p>
      {
        otpSent
          ? <button className='btn btn-sm btn-rounded col-6'>
              OTP Sent
            </button>
          : <button className='btn btn-sm btn-violet-rounded col-6' onClick={sendOtp}>
              Send OTP
            </button>
      }
      <div className={`form-group enter-passcode-section ${otpSent ? 'd-block' : 'd-none'}`}>
        <label className='form-label'>Enter OTP</label>
        <div className='passcode-card'>
          <input type='text' className='passcode-input' placeholder='....' onChange={e => handleChange(e.target.value)} value={otp} maxLength='4' />
        </div>
      </div>
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
