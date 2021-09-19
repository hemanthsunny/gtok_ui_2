import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { getQuery, firestore } from 'firebase_config'
import TransactionComponent from '../transaction/component'

function WalletDetailsComponent ({ currentUser, wallet }) {
  const [selectedWallet, setSelectedWallet] = useState(wallet)
  const [transactions, setTransactions] = useState('')
  const [passcode, setPasscode] = useState('')
  const [walletVerification, setWalletVerification] = useState(JSON.parse(sessionStorage.getItem('walletVerification')))
  const [btnDisable, setBtnDisable] = useState(passcode !== 4)
  const [result, setResult] = useState({})
  const history = useHistory()

  useEffect(() => {
    console.log('llll', selectedWallet)
    if (!selectedWallet) {
      getWallet()
    }
    async function getWallet () {
      const w = await getQuery(
        firestore.collection('wallets').where('userId', '==', currentUser.id).get()
      )
      if (w && w[0]) {
        setSelectedWallet(w[0])
      }
      getTransactions(w[0] || selectedWallet)
    }
    async function getTransactions (w) {
      const trns = await getQuery(
        firestore.collection('transactions').where('walletId', '==', w.id).orderBy('createdAt', 'desc').get()
      )
      setTransactions(trns.sort((a, b) => b.createdAt - a.createdAt))
    }
    if (walletVerification) {
      const currentTime = new Date().getTime()
      const walletSessionDuration = currentTime - parseInt(walletVerification.loginTime)
      /* Expire session after every 10 minutes / 600 seconds */
      if (walletSessionDuration > 600000) {
        sessionStorage.setItem('walletVerification', JSON.stringify({
          verified: false,
          loginTime: new Date().getTime()
        }))
        setWalletVerification({
          verified: false,
          loginTime: new Date().getTime()
        })
      }
    }
  }, [])

  const verifyPasscode = (pc) => {
    if (selectedWallet.passcode === pc) {
      sessionStorage.setItem('walletVerification', JSON.stringify({
        verified: true,
        loginTime: new Date().getTime()
      }))
      setWalletVerification({
        verified: true,
        loginTime: new Date().getTime()
      })
      setBtnDisable(false)
    } else {
      setResult({
        status: 400,
        message: 'Incorrect passcode'
      })
      sessionStorage.setItem('walletVerification', JSON.stringify({
        verified: false,
        loginTime: new Date().getTime()
      }))
      setWalletVerification({
        verified: false,
        loginTime: new Date().getTime()
      })
      setBtnDisable(true)
    }
  }

  const handleChange = (pc) => {
    setPasscode(pc)
    if (pc.length === 4) verifyPasscode(pc)
  }

  const redirectTo = (link) => {
    if (walletVerification && !walletVerification.verified) {
      return
    }
    history.push(link)
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
            {walletVerification && walletVerification.verified && <span className='text'>{selectedWallet.amount || 0}</span>}
          </div>
          <div className='balance-text'>Balance</div>
        </div>
        <div className='text-center'>
          <button className='btn btn-custom col-4 mr-2' onClick={e => redirectTo('/app/recharge')} disabled={walletVerification && !walletVerification.verified}>Recharge</button>
          <div className='btn btn-violet col-2 d-none'></div>
          <button className='btn btn-custom col-4 ml-2' onClick={e => redirectTo('/app/withdraw')} disabled={walletVerification && !walletVerification.verified}>Withdraw</button>
        </div>
      </div>
      {
        walletVerification && walletVerification.verified
          ? <div className='transactions-section'>
              <div className='all-transactions-text'>All transactions</div>
              <div className='transaction-card'>
                {
                  transactions[0]
                    ? transactions.map((trn, i) => (
                      <TransactionComponent wallet={wallet} transaction={trn} key={i}/>
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
              <input type='password' className='passcode-input' placeholder='....' onChange={e => handleChange(e.target.value)} maxLength='4' />
            </div>
            <div className='text-center'>
              {
                result.status &&
                <div className={`text-${result.status === 200 ? 'violet' : 'danger'} mt-3`}>
                  {result.message}
                </div>
              }
            </div>
            <button className='btn btn-violet-rounded btn-sm col-3 submit-passcode' disabled={btnDisable} onClick={verifyPasscode}>Done</button>
          </div>
      }
    </div>
  )
}

export default WalletDetailsComponent
