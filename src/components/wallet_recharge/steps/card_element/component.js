import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'

import { post } from 'services'
import { add } from 'firebase_config'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: 'Helvetica Neue',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
}

// Ref1: Testing cards - https://stripe.com/docs/testing
// Ref2: Functionality - https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements

function CardElementComponent ({ currentUser, paymentIntent }) {
  const [loading, setLoading] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const history = useHistory()

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }
    setLoading(true)
    const result = await stripe.confirmCardPayment(paymentIntent.client_secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: currentUser.username
        }
      }
    })

    if (result.error) {
      setLoading(false)
      toast.error(result.error.message)
      /* Cancel the payment intent */
      await post('/transaction/cancel', {
        paymentIntentId: paymentIntent.id
      })
      if (result.error.type !== 'validation_error') {
        history.push('/app/wallet')
      }
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
        const res = await post('/transaction/recharge', {
          amount: result.paymentIntent.amount,
          paymentIntentId: result.paymentIntent.id,
          currency: result.paymentIntent.currency
        })
        if (res.status === 201) {
          toast.success('Recharge successful')
          /* Log the activity */
          await add('logs', {
            text: `Your wallet recharge of ${result.paymentIntent.amount}/- has been successful`,
            photoURL: currentUser.photoURL,
            receiverId: currentUser.id,
            actionLink: '/app/wallet/',
            unread: true
          })
          setLoading(false)
        } else {
          toast.error('Recharge is unsuccessful. If your card has been debited, please contact the admin team.')
          /* Log the activity */
          await add('logs', {
            text: `Your wallet recharge of ${result.paymentIntent.amount}/- has been failed`,
            photoURL: currentUser.photoURL,
            receiverId: currentUser.id,
            actionLink: '/app/wallet/',
            unread: true
          })
          setLoading(false)
        }
      }
      history.push('/app/wallet')
    }
  }

  return (
    <div className='change-pc-wrapper enter-passcode-section'>
      <div className='form-group'>
        <label className='form-label'>Card details</label>
        <div className='passcode-card mt-3'>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>
      <div className='font-small pb-2'>
        <small>*Only credit and debit cards accepted at the moment.</small>
      </div>
      <button className='btn btn-sm btn-violet-rounded col-4' onClick={handleSubmit} disabled={!stripe || loading}>
        {
          loading
            ? <div className='spinner-border spinner-border-sm' role='status'>
              <span className='sr-only'>Loading...</span>
            </div>
            : <span>Confirm</span>
        }
      </button>
    </div>
  )
}

export default CardElementComponent
