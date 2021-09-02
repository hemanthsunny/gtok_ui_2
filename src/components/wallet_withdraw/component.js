import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import './style.css'

import HeaderComponent from './header'
import PayoutDetailsComponent from './steps/payout_details/component'
import ConfirmComponent from './steps/confirm/component'
import { add, getQuery, firestore } from 'firebase_config'

function WalletWithdrawComponent ({ currentUser }) {
  const [withdrawAmount, setWithdrawAmount] = useState()
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifscCode, setIfscCode] = useState('')
  const [stepNumber, setStepNumber] = useState(1)
  const [result, setResult] = useState({})
  const [selectedWallet, setSelectedWallet] = useState('')
  const history = useHistory()

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

  const save = async () => {
    if (withdrawAmount < 10) {
      setResult({
        status: 400,
        message: 'Minimum amount to withdraw is 500'
      })
      return null
    }
    if (!accountName) {
      setResult({
        status: 400,
        message: 'Account holder name is required'
      })
      return null
    }
    if (!accountNumber) {
      setResult({
        status: 400,
        message: 'Account number must be valid'
      })
      return null
    }

    if (!ifscCode) {
      setResult({
        status: 400,
        message: 'IFSC code must be valid'
      })
      return null
    }

    const data = {
      userId: currentUser.id,
      amount: withdrawAmount,
      currency: currentUser.currency || 'inr',
      type: 'withdraw',
      status: 'pending'
    }

    const res = await add('transactions', data)
    setResult(res)
    setTimeout(() => {
      setResult('')
      setWithdrawAmount(0)
    }, 3000)
    if (res.status === 200) {
      history.push('/app/wallet')
    }
  }

  return (
    <div>
      <HeaderComponent/>
      <div className='dashboard-content -xs-bg-none'>
        <div className='text-center'>
          {
            result.status &&
            <div className={`text-${result.status === 200 ? 'violet' : 'danger'} my-2`}>
              {result.message}
            </div>
          }
        </div>
        { stepNumber === 1 && <PayoutDetailsComponent currentUser={currentUser} wallet={selectedWallet} setStepNumber={setStepNumber} withdrawAmount={withdrawAmount} setWithdrawAmount={setWithdrawAmount} accountName={accountName} setAccountName={setAccountName} accountNumber={accountNumber} setAccountNumber={setAccountNumber} ifscCode={ifscCode} setIfscCode={setIfscCode} /> }
        { stepNumber === 2 && <ConfirmComponent currentUser={currentUser} wallet={selectedWallet} setStepNumber={setStepNumber} save={save} withdrawAmount={withdrawAmount} accountName={accountName} accountNumber={accountNumber} ifscCode={ifscCode} /> }
      </div>
    </div>
  )
}

export default WalletWithdrawComponent

// Ref: https://stackoverflow.com/questions/55156572/how-to-give-automatic-spaces-in-credit-card-validation-slash-in-a-date-format-v
