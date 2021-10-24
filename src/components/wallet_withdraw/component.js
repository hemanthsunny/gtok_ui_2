import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import moment from 'moment'
// import $ from 'jquery'
import './style.css'

import HeaderComponent from './header'
import PayoutDetailsComponent from './steps/payout_details/component'
import ConfirmComponent from './steps/confirm/component'
import { getQuery, firestore } from 'firebase_config'
import { post } from 'services'

function WalletWithdrawComponent ({ currentUser }) {
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifscCode, setIfscCode] = useState('')
  const [stepNumber, setStepNumber] = useState(1)
  const [result, setResult] = useState({})
  const [selectedWallet, setSelectedWallet] = useState('')
  const [withdrawTransaction, setWithdrawTransaction] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  useEffect(() => {
    async function getWalletDetails () {
      const wallet = await getQuery(
        firestore.collection('wallets').where('userId', '==', currentUser.id).get()
      )
      if (wallet[0]) {
        setSelectedWallet(wallet[0])
        getWithdrawTransaction()
      }
    }

    async function getWithdrawTransaction () {
      const trn = await getQuery(
        firestore.collection('transactions').where('userId', '==', currentUser.id).where('withdrawalRequest', '==', true).get()
      )
      if (trn[0]) {
        setWithdrawTransaction(trn[0])
      }
    }

    if (!selectedWallet) {
      getWalletDetails()
    }
  }, [])

  const save = async () => {
    if (withdrawAmount < 10) {
      toast.error('Minimum amount to withdraw is INR 500/-')
      return null
    }
    if (!accountName) {
      toast.error('Account holder name is required')
      return null
    }
    if (!accountNumber) {
      toast.error('Account number must be valid')
      return null
    }

    if (!ifscCode) {
      toast.error('IFSC code must be valid')
      return null
    }

    setLoading(true)
    const data = {
      userId: currentUser.id,
      walletId: selectedWallet.id,
      amount: +withdrawAmount,
      currency: currentUser.currency || 'inr',
      type: 'debit',
      status: 'pending',
      withdrawalRequest: true,
      withdrawalDate: await getWithdrawalDate()
    }

    const res = await post('/transaction/withdraw', {
      date: data.withdrawalDate,
      amount: withdrawAmount,
      currency: 'inr'
    })

    if (res.status === 201) {
      toast.success('We received your withdrawal request.')
    } else {
      toast.error('Withdrawal request is unsuccessful. Try again later.')
    }
    history.push('/app/wallet')

    setResult(res)
    setStepNumber(3)
    setWithdrawTransaction(data)
    setLoading(false)
    setTimeout(() => {
      setResult('')
      setWithdrawAmount(0)
    }, 3000)
  }

  const getWithdrawalDate = () => {
    let date = new Date()
    const getDate = date.getDate()
    date.setDate(15)
    if (getDate >= 15) {
      date = `15/${moment().add(1, 'months').format('MM/YYYY')}`
      // date.setMonth(date.getMonth() + 1)
    } else {
      date = `15/${moment().format('MM/YYYY')}`
    }
    return date
  }

  const closeModal = () => {
    history.push('/app/wallet')
    // $('#alertModal').hide()
    // $('.modal-backdrop').remove()
    // $('body').removeClass('modal-open')
  }

  const alertTemplate = () => (
    <div className='p-3 pt-5 text-center'>
      <p className='p-2'>
        Your withdrawal request has been received. The withdraw amount will be credited by {withdrawTransaction.withdrawalDate}.
      </p>
      <button className='btn btn-sm btn-violet-rounded mb-3' onClick={closeModal}>
        Done
      </button>
    </div>
  )

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
        {
          !withdrawTransaction
            ? <div>
              { stepNumber === 1 && <PayoutDetailsComponent currentUser={currentUser} wallet={selectedWallet} setStepNumber={setStepNumber} withdrawAmount={withdrawAmount} setWithdrawAmount={setWithdrawAmount} accountName={accountName} setAccountName={setAccountName} accountNumber={accountNumber} setAccountNumber={setAccountNumber} ifscCode={ifscCode} setIfscCode={setIfscCode} /> }
              { stepNumber === 2 && <ConfirmComponent currentUser={currentUser} wallet={selectedWallet} setStepNumber={setStepNumber} save={save} withdrawAmount={withdrawAmount} accountName={accountName} accountNumber={accountNumber} ifscCode={ifscCode} loading={loading} /> }
              {
                stepNumber === 3 && <div className='container desktop-align-center'>
                  {alertTemplate()}
                </div>
              }
            </div>
            : <div className='container desktop-align-center'>
            {alertTemplate()}
            </div>
        }
      </div>
    </div>
  )
}

export default WalletWithdrawComponent

// Ref: https://stackoverflow.com/questions/55156572/how-to-give-automatic-spaces-in-credit-card-validation-slash-in-a-date-format-v
