import React, { useState, useEffect } from 'react'
import './style.css'

import HeaderComponent from './header'
import UpdatePasscodeComponent from './steps/update/component'
import OtpComponent from './steps/otp/component'
import { add, update, getQuery, firestore } from 'firebase_config'

function ChangePasscodeComponent ({ currentUser }) {
  const [passcodeState, setPasscodeState] = useState({
    oldPasscode: '',
    newPasscode: '',
    confirmPasscode: ''
  })
  const [stepNumber, setStepNumber] = useState(1)
  const [result, setResult] = useState({})
  const [selectedWallet, setSelectedWallet] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function getWalletDetails () {
      const wallet = await getQuery(
        firestore.collection('wallets').where('userId', '==', currentUser.id).get()
      )
      if (wallet[0]) {
        setSelectedWallet(wallet[0])
      }
    }

    if (!selectedWallet) {
      getWalletDetails()
    }
  }, [])

  const savePasscode = async () => {
    if (selectedWallet && (passcodeState.oldPasscode !== selectedWallet.passcode)) {
      setResult({
        status: 400,
        message: 'Old passcode is wrong'
      })
      return null
    }
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
    setLoading(true)
    const wallet = await getQuery(
      firestore.collection('wallets').where('userId', '==', currentUser.id).get()
    )

    let res
    if (selectedWallet || wallet[0]) {
      const data = {
        passcode: passcodeState.newPasscode,
        otp: null,
        verified: false
      }
      res = await update('wallets', (selectedWallet.id || wallet[0].id), data)
    } else {
      const data = {
        userId: currentUser.id,
        amount: 0,
        passcode: passcodeState.newPasscode,
        otp: null,
        verified: false
      }
      res = await add('wallets', data)
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
    if (res.status === 200) {
      setStepNumber(2)
    }
    setLoading(false)
  }

  return (
    <div>
      <HeaderComponent/>
      <div>
        <div className='dashboard-content -xs-bg-none'>
          <div className='change-pc-wrapper desktop-align-center'>
            { stepNumber === 1 && !selectedWallet.otp && <UpdatePasscodeComponent currentUser={currentUser} passcodeState={passcodeState} setPasscodeState={setPasscodeState} setStepNumber={setStepNumber} savePasscode={savePasscode} wallet={selectedWallet} loading={loading} /> }
            { (stepNumber === 2 || selectedWallet.otp) && <OtpComponent currentUser={currentUser} passcodeState={passcodeState} setPasscodeState={setPasscodeState} setStepNumber={setStepNumber} selectedWallet={selectedWallet} /> }
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

export default ChangePasscodeComponent
