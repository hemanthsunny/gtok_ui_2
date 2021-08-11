import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import HeaderComponent from './header.js'

import { add, getId, getQuery, update, firestore } from 'firebase_config'
import CalculatePriceComponent from './steps/calculate_price/component'
import PaymentMethodComponent from './steps/payment_method/component'
import CardDetailsComponent from './steps/card_details/component'
import SubmitComponent from './steps/submit/component'

function AddPriceComponent (props) {
  const { currentUser } = props
  const [price, setPrice] = useState('')
  const [months, setMonths] = useState(1)
  const [result, setResult] = useState('')
  const [user, setUser] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardDetails, setCardDetails] = useState('')
  const userId = props.computedMatch.params.post_id
  const [stepNumber, setStepNumber] = useState(1)
  const [loading, setLoading] = useState(false)
  const [recentActiveOrder, setRecentActiveOrder] = useState(false)
  const history = useHistory()

  useEffect(() => {
    async function getUser () {
      let u = await getId('users', userId)
      u = Object.assign(u, { id: userId })
      setUser(u)
      await getOrders()
    }

    async function getOrders () {
      const recentActiveOrder = await getQuery(
        firestore.collection('purchaseOrders').where('userId', '==', currentUser.id).where('profileUserId', '==', userId).where('active', '==', true).orderBy('createdAt', 'desc').get()
      )
      if (recentActiveOrder[0]) {
        setRecentActiveOrder(recentActiveOrder[0])
      } else {
        await getPrice()
      }
    }

    async function getPrice () {
      const p = await getQuery(
        firestore.collection('prices').where('userId', '==', userId).get()
      )
      if (p[0] && p[0].amount) {
        setPrice(p[0])
        setTotalPrice(p[0].amount * months)
      } else { setPrice('') }
    }

    if (userId) {
      getUser()
    }
  }, [userId])

  const savePurchaseOrder = async () => {
    setLoading(true)
    const data = {
      userId: currentUser.id,
      profileUserId: user.id,
      purchaseOrder: {
        profileName: user.displayName,
        pricePerMonth: price.amount,
        totalMonths: months,
        totalPrice: totalPrice,
        currency: 'INR',
        validFrom: moment().format('DD-MM-YYYY'),
        validUntil: moment().add(months * 30, 'd').format('DD-MM-YYYY'),
        unlockValidity: `${months * 30} days`
      },
      active: true
    }

    /* Steps to follow -
      1. Create purchaseOrder
      2. Get purchaseOrderId
      3. Create transaction
      4. If transaction success,
        a. update amount in wallet
        b. change 'purchaseActiveStatus' to 'active' in 'purchaseOrder' table
      5. If transaction fails,
        a. update transaction
    */
    let result
    /* 1 */
    result = await add('purchaseOrders', data)
    /* 2,3,4 */
    await getQuery(
      firestore.collection('purchaseOrders').where('userId', '==', currentUser.id).where('profileUserId', '==', user.id).where('active', '==', true).orderBy('createdAt', 'desc').get()
    ).then(async (recentOrder) => {
      if (recentOrder[0]) {
        await getQuery(
          firestore.collection('wallets').where('userId', '==', user.id).get()
        ).then(async (wallet) => {
          const trnData = {
            orderId: recentOrder[0].id,
            fromUserId: currentUser.id,
            toUserId: user.id,
            toUserName: user.displayName,
            toUserWalletId: wallet[0].id,
            amount: totalPrice,
            currency: 'INR',
            paymentMethod,
            paymentDetails: cardDetails,
            status: 'success', // pending, success, fail
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
          await add('transactions', trnData)
          /* Call API here */
          const walletBalance = wallet[0].amount + (+totalPrice)
          result = await update('wallets', wallet[0].id, { amount: walletBalance })
        })
      }
    })

    /* 3. */

    /* Log the activity */
    // await add('logs', {
    //   text: `${currentUser.displayName} posted an activity`,
    //   userId: currentUser.id,
    //   collection: 'paymentCards',
    //   timestamp
    // });
    setLoading(false)
    setResult(result)
    if (result.status === 200) {
      history.push({
        pathname: '/app/settings/purchase_orders'
      })
    }
  }

  return (
    <div>
      <HeaderComponent user={user} />
      <div className='container unlock-profile-wrapper'>
        {
          recentActiveOrder
            ? <div className='text-center recent-active-wrapper'>
            <small>You've already unlocked.</small>
          </div>
            : <div>
            { stepNumber === 1 && <CalculatePriceComponent setStepNumber={setStepNumber} user={user} months={months} setMonths={setMonths} price={price} totalPrice={totalPrice} setTotalPrice={setTotalPrice} /> }
            { stepNumber === 2 && <PaymentMethodComponent setStepNumber={setStepNumber} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}/> }
            { stepNumber === 3 && <CardDetailsComponent setStepNumber={setStepNumber} currentUser={currentUser} setCardDetails={setCardDetails}/> }
            { stepNumber === 4 && <SubmitComponent save={savePurchaseOrder} setStepNumber={setStepNumber} cardDetails={cardDetails} price={price} paymentMethod={paymentMethod} user={user} months={months} totalPrice={totalPrice} loading={loading}/> }
          </div>
        }
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

export default AddPriceComponent
