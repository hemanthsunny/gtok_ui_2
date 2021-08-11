import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { getQuery, firestore } from 'firebase_config'

function WalletDetailsComponent ({ wallet }) {
  const [transactions, setTransactions] = useState('')
  const [passcode, setPasscode] = useState('')
  const [walletVerification, setWalletVerification] = useState(JSON.parse(localStorage.getItem('walletVerification')))

  useEffect(() => {
    async function getTransactions () {
      const trns = await getQuery(
        firestore.collection('transactions').where('toUserWalletId', '==', wallet.id).get()
      )
      setTransactions(trns)
    }
    if (wallet.id) {
      getTransactions()
    }
  }, [])

  const verifyPasscode = () => {
    // if (wallet.passcode === passcode) {
    localStorage.setItem('walletVerification', JSON.stringify({
      verified: true,
      loginTime: new Date().getTime()
    }))
    setWalletVerification({
      verified: true,
      loginTime: new Date().getTime()
    })
    // }
  }

  return (
    <div className='wallet-details-wrapper'>
      <div className='total-amount-section'>
        <div className='d-flex justify-content-between align-items-baseline py-3 px-3'>
          <Link to='/app/profile'>
            <img src={require('assets/svgs/LeftArrowWhite.svg').default} className='posts-icon pull-left' alt='Posts' />
          </Link>
          <div className='page-header'>
            Wallet
          </div>
          <Link to='/app/wallet_settings'>
            <img src={require('assets/svgs/Settings.svg').default} className='posts-icon pull-left' alt='Settings' />
          </Link>
        </div>
        <div className='balance-details'>
          <div className='balance-amount'>
            <img src={require('assets/svgs/currency/inr.svg').default} className='posts-icon' alt='Posts' />
            {walletVerification.verified && <span className='text'>{wallet.balance || 0}</span>}
          </div>
          <div className='balance-text'>Balance</div>
        </div>
        <div className='text-center'>
          <button className='btn btn-custom col-4 mr-2' disabled={!walletVerification.verified}>Recharge</button>
          <div className='btn btn-violet col-2 d-none'></div>
          <button className='btn btn-custom col-4 ml-2' disabled={!walletVerification.verified}>Withdraw</button>
        </div>
      </div>
      {
        walletVerification.verified
          ? <div className='transactions-section'>
              <div className='all-transactions-text'>All transactions</div>
              <div className='transaction-card'>
                {
                  transactions[0]
                    ? transactions.map((trn, i) => (
                    <div className='card p-2' key={i}>
                      <div className='flex-row'>
                        <div className='pull-left pl-0 transaction-name'>{trn.toUserName}</div>
                        <div className='pull-right transaction-amount credit'>
                          {trn.currency} {trn.amount}
                        </div>
                      </div>
                      <div className='text-secondary pt-2'>
                        <div className='transaction-date'>Purchase order id: {trn.orderId}</div>
                        <div className='transaction-date'>Transaction date: {moment(trn.createdAt).format('DD-MM-YYYY HH:MM:SS')}</div>
                      </div>
                    </div>
                    ))
                    : <div className='text-center'>
                    <small>No transactions yet</small>
                  </div>
                }
              </div>
            </div>
          : <div className='enter-passcode-section'>
            <div className='passcode-text'>Enter passcode</div>
            <div className='passcode-card'>
              <input type='password' className='passcode-input' placeholder='....' onChange={e => setPasscode(e.target.value)} maxLength='4' />
            </div>
            <button className='btn btn-violet-rounded btn-sm col-3 submit-passcode' disabled={passcode.length !== 4} onClick={verifyPasscode}>Done</button>
          </div>
      }
    </div>
  )
}

export default WalletDetailsComponent
