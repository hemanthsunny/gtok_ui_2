import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import './style.css'

import HeaderComponent from './header'
import { add, update, getQuery, firestore } from 'firebase_config'

function WalletRechargeComponent ({ currentUser }) {
  const [rechargeAmount, setRechargeAmount] = useState(10)
  const [cardHolderName, setCardHolderName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpireDate, setCardExpireDate] = useState('')
  const [cardCvv, setCardCvv] = useState('')
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

  const saveRecharge = async () => {
    if (rechargeAmount < 10) {
      setResult({
        status: 400,
        message: 'Minimum amount to recharge is 10'
      })
      return null
    }
    if (!cardHolderName) {
      setResult({
        status: 400,
        message: 'Card holder name is required'
      })
      return null
    }
    if (!cardExpireDate) {
      setResult({
        status: 400,
        message: 'Card expire date must be valid'
      })
      return null
    }

    if (!cardCvv) {
      setResult({
        status: 400,
        message: 'CVV must be valid'
      })
      return null
    }

    const data = {
      amount: (isNaN(selectedWallet.amount) ? 0 : selectedWallet.amount) + +rechargeAmount
    }

    const res = await update('wallets', selectedWallet.id, data)
    await add('transactions', {
      userId: currentUser.id,
      walletId: selectedWallet.id,
      postId: '',
      currency: currentUser.currency || 'inr',
      amount: +rechargeAmount,
      type: 'credit',
      status: 'success',
      trackDetails: {
        location: {
          country: null,
          address: null
        },
        system: {
          ipAddress: null,
          browser: null
        }
      }
    })

    setResult(res)
    setTimeout(() => {
      setResult('')
      setRechargeAmount(10)
    }, 3000)
    if (res.status === 200) {
      history.push('/app/wallet')
    }
  }

  const handleChange = (key, val) => {
    if (key === 'cardNumber') {
      setCardNumber(val)
    }
    if (key === 'cardExpireDate') {
      if (val.length === 2) {
        val = val + '/'
      }
      setCardExpireDate(val)
    }
  }

  return (
    <div>
      <HeaderComponent/>
      <div className='dashboard-content -xs-bg-none pt-md-1'>
        <div className='wallet-recharge-wrapper desktop-align-center'>
          <div className=''>
            <div className=''>
              <div className='form-group'>
                <label className='form-label recharge-amount-label'>Recharge amount</label>
                <input type='number' className='form-control recharge-amount col-6' placeholder='....' onChange={e => setRechargeAmount(e.target.value)} value={rechargeAmount} />
              </div>
              <h6 className='my-4'>Card details</h6>
              <div className='form-group'>
                <label className='form-label'>Name on card</label>
                <input type='text' className='form-control text-uppercase' placeholder='GEORGIA JOSEPH' onChange={e => setCardHolderName(e.target.value)} value={cardHolderName} />
              </div>
              <div className='form-group'>
                <label className='form-label'>Card number</label>
                <input type='text' className='form-control' placeholder='16-digit number' onChange={e => handleChange('cardNumber', e.target.value)} value={cardNumber} />
              </div>
              <div className='row'>
                <div className='form-group col-6'>
                  <label className='form-label'>Expiry date</label>
                  <input type='text' className='form-control' placeholder='MM/YYYY' onChange={e => handleChange('cardExpireDate', e.target.value)} value={cardExpireDate} autoComplete='none' />
                </div>
                <div className='form-group col-6'>
                  <label className='form-label'>CVV</label>
                  <input type='password' className='form-control' placeholder='. . .' onChange={e => setCardCvv(e.target.value)} value={cardCvv} maxLength='3' autoComplete='none' />
                </div>
              </div>
            </div>
            <div className='text-center mt-4'>
              {
                result.status &&
                <small className={`text-${result.status === 200 ? 'violet' : 'danger'} my-2`}>
                  {result.message} <br/>
                </small>
              }
              <button className='btn btn-sm btn-violet-rounded col-5' onClick={saveRecharge}>
                Recharge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletRechargeComponent

// Ref: https://stackoverflow.com/questions/55156572/how-to-give-automatic-spaces-in-credit-card-validation-slash-in-a-date-format-v
