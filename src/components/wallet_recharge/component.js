import React, { useState } from 'react'
import './style.css'

import HeaderComponent from './header'
import CheckoutComponent from './steps/checkout/component'
import CardDetailsComponent from './steps/card_details/component'

function WalletRechargeComponent ({ currentUser }) {
  const [rechargeAmount, setRechargeAmount] = useState(50)
  const [stepNumber, setStepNumber] = useState(1)
  const [paymentIntent, setPaymentIntent] = useState('')

  return (
    <div>
      <HeaderComponent/>
      <div className='dashboard-content -xs-bg-none pt-md-1'>
        <div className='wallet-recharge-wrapper desktop-align-center'>
          {stepNumber === 1 && <CheckoutComponent currentUser={currentUser} rechargeAmount={rechargeAmount} setRechargeAmount={setRechargeAmount} setStepNumber={setStepNumber} paymentIntent={paymentIntent} setPaymentIntent={setPaymentIntent} />}
          {stepNumber === 2 && <CardDetailsComponent currentUser={currentUser} rechargeAmount={rechargeAmount} setStepNumber={setStepNumber} paymentIntent={paymentIntent} />}
        </div>
      </div>
    </div>
  )
}

export default WalletRechargeComponent

// Ref: https://stackoverflow.com/questions/55156572/how-to-give-automatic-spaces-in-credit-card-validation-slash-in-a-date-format-v
