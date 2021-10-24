import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import HeaderComponent from './header.js'
import './style.css'

import { getId } from 'firebase_config'
import CalculatePriceComponent from './steps/calculate_price/component'
import PaymentMethodComponent from './steps/payment_method/component'
import CardDetailsComponent from './steps/card_details/component'
import SubmitComponent from './steps/submit/component'

function TradePostComponent (props) {
  const { currentUser } = props
  const [months, setMonths] = useState(1)
  const [result, setResult] = useState('')
  const [displayPost, setDisplayPost] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardDetails, setCardDetails] = useState('')
  const postId = props.computedMatch.params.post_id
  const [stepNumber, setStepNumber] = useState(1)
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  useEffect(() => {
    async function getPost () {
      let p = await getId('posts', postId)
      p = Object.assign(p, { id: postId })
      setDisplayPost(p)
    }

    if (postId) {
      getPost()
    }
  }, [postId])

  const savePurchaseOrder = async () => {
    setLoading(true)
    /* Steps to follow -
      1. Create transaction
      2. If transaction success,
        a. update amount in wallet
        b. change 'purchaseActiveStatus' to 'active' in 'purchaseOrder' table
      3. If transaction fails,
        a. update transaction
    */
    // let result
    const data = {
      userId: currentUser.id,
      postId,
      currency: currentUser.currency,
      tradePrice: displayPost.tradePrice,
      status: 'pending',
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
    }
    console.log('data', data)
    /* Call API here */
    // API should take care of completing the transaction status
    // API should update the wallet balance after successful transaction
    // API should return a response on
    // const walletBalance = wallet[0].amount + (+totalPrice)
    // result = await update('wallets', wallet[0].id, { amount: walletBalance })

    /* Log the activity */
    // await add('logs', {
    //   text: `${currentUser.displayName} posted an activity`,
    //   userId: currentUser.id,
    //   collection: 'paymentCards',
    //   timestamp
    // });
    setLoading(false)
    setResult('result')
    if (result.status === 200) {
      history.push({
        pathname: '/app/assets/displayPost.id'
      })
    }
  }

  return (
    <div>
      <HeaderComponent />
      <div className='container unlock-profile-wrapper'>
        {displayPost.id}
        { stepNumber === 1 && <CalculatePriceComponent setStepNumber={setStepNumber} months={months} setMonths={setMonths} totalPrice={totalPrice} setTotalPrice={setTotalPrice} /> }
        { stepNumber === 2 && <PaymentMethodComponent setStepNumber={setStepNumber} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}/> }
        { stepNumber === 3 && <CardDetailsComponent setStepNumber={setStepNumber} currentUser={currentUser} setCardDetails={setCardDetails}/> }
        { stepNumber === 4 && <SubmitComponent save={savePurchaseOrder} setStepNumber={setStepNumber} cardDetails={cardDetails} paymentMethod={paymentMethod} months={months} totalPrice={totalPrice} loading={loading}/> }
        <div className='text-center'>
          {
            result.status &&
            <div className={`text-${result.status === 200 ? 'success' : 'danger'} mb-2`}>
              {result.message}
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default TradePostComponent
