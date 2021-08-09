import React, { useState } from 'react'
import { connect } from 'react-redux'
import './style.css'

import HeaderComponent from './header'
import UpdatePasscodeComponent from './steps/update/component'
import OtpComponent from './steps/otp/component'
import { add, update } from 'firebase_config'

function ChangePasscodeComponent ({ currentUser, wallet }) {
  const [passcodeState, setPasscodeState] = useState({
    oldPasscode: '',
    newPasscode: '',
    confirmPasscode: ''
  })
  const [stepNumber, setStepNumber] = useState(1)
  const [result, setResult] = useState({})
  const selectedWallet = (wallet && wallet[0]) || ''

  const updatePassword = async () => {
    if (!passcodeState.newPasscode) {
      setResult({
        status: 400,
        message: 'New passcode should be filled'
      })
      return null
    }
    if (!passcodeState.confirmPasscode) {
      setResult({
        status: 400,
        message: 'Confirm password should be filled'
      })
      return null
    }
    if (passcodeState.newPasscode !== passcodeState.confirmPasscode) {
      setResult({
        status: 400,
        message: 'Passcode\'s didn\'t match'
      })
      return null
    }

    let res
    if (!selectedWallet) {
      const data = {
        userId: currentUser.id,
        amount: 0,
        passcode: passcodeState.newPasscode
      }
      res = await add('wallets', data)
    } else {
      const data = {
        passcode: passcodeState.newPasscode
      }
      res = await update('wallets', selectedWallet.id, data)
    }
    setResult(res)
    setTimeout(() => {
      setResult('')
      setPasscodeState({
        oldPasscode: '',
        newPasscode: '',
        confirmPasscode: ''
      })
    }, 3000)
  }

  return (
    <div>
      <HeaderComponent save={updatePassword}/>
      <div>
        <div className='dashboard-content -xs-bg-none'>
          <div className='change-pc-wrapper desktop-align-center'>
            { stepNumber === 1 && <UpdatePasscodeComponent currentUser={currentUser} passcodeState={passcodeState} setPasscodeState={setPasscodeState} setStepNumber={setStepNumber} /> }
            { stepNumber === 2 && <OtpComponent currentUser={currentUser} passcodeState={passcodeState} setPasscodeState={setPasscodeState} setStepNumber={setStepNumber} /> }
            <div className='text-center'>
              {
                result.status &&
                <div className={`text-${result.status === 200 ? 'violet' : 'danger'} my-2`}>
                  {result.message}
                </div>
              }
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

export default connect(
  mapStateToProps,
  null
)(ChangePasscodeComponent)
