import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { getQuery, firestore } from 'firebase_config'

function WalletDetailsComponent ({ wallet }) {
  const [transactions, setTransactions] = useState('')

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

  return (
    <div className='wallet-details-wrapper'>
    <div className='profile-wrapper'>
      <div className='container'>
        <div className='d-flex justify-content-between align-items-baseline py-3 px-3'>
          <Link to='/app/profile'>
            <img src={require('assets/svgs/LeftArrowWhite.svg').default} className='posts-icon pull-left' alt='Posts' />
          </Link>
          <div className='fw-500'>
            Wallet
          </div>
          <Link to='/app/wallet_settings'>
            <img src={require('assets/svgs/Settings.svg').default} className='posts-icon pull-left' alt='Settings' />
          </Link>
        </div>
        <div className='text-center'>
          <h3>
            <div className='display-picture'>
              100
            </div>
            <div className='my-2'>Balance</div>
          </h3>
        </div>
      </div>
      <div className='text-center'>
        <div className='btn btn-custom col-4 mr-2'>Recharge</div>
        <div className='btn btn-violet col-2 d-none'></div>
        <div className='btn btn-custom col-4 ml-2'>Withdraw</div>
      </div>
    </div>
      <div className='card p-3'>
        <div className='flex-row'>
          <div className='pull-left'>Amount</div>
          <div className='pull-right'>{wallet.currency} {wallet.amount}</div>
        </div>
        <div className='text-secondary'>
          <small>The minimum withdrawal amount is INR 650/-</small>
        </div>
      </div>
      <div className='my-2'>
        <div className='header'>All transactions</div>
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
    </div>
  )
}

export default WalletDetailsComponent
