import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
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
      toast.error('Old passcode is wrong')
      return null
    }
    if (!passcodeState.newPasscode) {
      toast.error('New passcode should be filled')
      return null
    }
    if (!passcodeState.confirmPasscode) {
      toast.error('Confirm passcode should be filled')
      return null
    }
    if (passcodeState.newPasscode !== passcodeState.confirmPasscode) {
      toast.error('Passcodes didn\'t match')
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
    setTimeout(() => {
      setPasscodeState({
        oldPasscode: '',
        newPasscode: '',
        confirmPasscode: ''
      })
    }, 3000)
    if (res.status === 200) {
      toast.success('Your wallet passcode updated successfully')
      setStepNumber(2)
    } else {
      toast.error('Something went wrong. Try later!')
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePasscodeComponent
