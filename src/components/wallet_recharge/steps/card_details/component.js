import React from 'react'

// Stripe pkgs
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import CardElementComponent from '../card_element/component'
// import { getQuery, firestore } from 'firebase_config'
// import { post } from 'services'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY_TEST)

function CardDetailsComponent ({ currentUser, rechargeAmount, paymentIntent }) {
  return (
    <Elements stripe={stripePromise}>
      <CardElementComponent paymentIntent={paymentIntent} currentUser={currentUser} />
    </Elements>
  )
}

export default CardDetailsComponent

// const [cardHolderName, setCardHolderName] = useState('')
// const [cardNumber, setCardNumber] = useState('')
// const [cardExpireDate, setCardExpireDate] = useState('')
// const [cardCvv, setCardCvv] = useState('')
// const [result, setResult] = useState({})
// const [selectedWallet, setSelectedWallet] = useState('')
// const history = useHistory()
//
// useEffect(() => {
//   async function getWalletDetails () {
//     const wallet = await getQuery(
//       firestore.collection('wallets').where('userId', '==', currentUser.id).get()
//     )
//     if (wallet[0]) {
//       setSelectedWallet(wallet[0])
//     }
//   }
//
//   if (!selectedWallet) {
//     getWalletDetails()
//   }
// }, [])
//
// const saveRecharge = async () => {
//   if (rechargeAmount < 10) {
//     setResult({
//       status: 400,
//       message: 'Minimum amount to recharge is 10'
//     })
//     return null
//   }
//   if (!cardHolderName) {
//     setResult({
//       status: 400,
//       message: 'Card holder name is required'
//     })
//     return null
//   }
//   if (!cardExpireDate) {
//     setResult({
//       status: 400,
//       message: 'Card expire date must be valid'
//     })
//     return null
//   }
//
//   if (!cardCvv) {
//     setResult({
//       status: 400,
//       message: 'CVV must be valid'
//     })
//     return null
//   }
//
//   // const data = {
//   //   amount: (isNaN(selectedWallet.amount) ? 0 : selectedWallet.amount) + +rechargeAmount
//   // }

// const res = await post('/transaction/recharge', {
//   amount: rechargeAmount,
//   cardDetails: {
//     name: cardHolderName,
//     number: cardNumber,
//     expiredate: cardExpireDate,
//     cvv: cardCvv
//   }
// })

// const res = await update('wallets', selectedWallet.id, data)
// await add('transactions', {
//   userId: currentUser.id,
//   walletId: selectedWallet.id,
//   postId: '',
//   currency: currentUser.currency || 'inr',
//   amount: +rechargeAmount,
//   type: 'credit',
//   status: 'success',
//   trackDetails: {
//     location: {
//       country: null,
//       address: null
//     },
//     system: {
//       ipAddress: null,
//       browser: null
//     }
//   }
// })
//
// setResult(res)
// setTimeout(() => {
//   setResult('')
//   setRechargeAmount(10)
// }, 3000)
// if (res.status === 200) {
//   history.push('/app/wallet')
// }
// }
//
// const handleChange = (key, val) => {
// if (key === 'cardNumber') {
//   setCardNumber(val)
// }
// if (key === 'cardExpireDate') {
//   if (val.length === 2) {
//     val = val + '/'
//   }
//   setCardExpireDate(val)
// }
// }
//

//
// <div className=''>
//   <div className=''>
//     <h6 className='my-4'>Card details</h6>
//     <div className='form-group'>
//       <label className='form-label'>Name on card</label>
//       <input type='text' className='form-control text-uppercase' placeholder='GEORGIA JOSEPH' onChange={e => setCardHolderName(e.target.value)} value={cardHolderName} />
//     </div>
//     <div className='form-group'>
//       <label className='form-label'>Card number</label>
//       <input type='text' className='form-control' placeholder='16-digit number' onChange={e => handleChange('cardNumber', e.target.value)} value={cardNumber} />
//     </div>
//     <div className='row'>
//       <div className='form-group col-6'>
//         <label className='form-label'>Expiry date</label>
//         <input type='text' className='form-control' placeholder='MM/YYYY' onChange={e => handleChange('cardExpireDate', e.target.value)} value={cardExpireDate} autoComplete='none' />
//       </div>
//       <div className='form-group col-6'>
//         <label className='form-label'>CVV</label>
//         <input type='password' className='form-control' placeholder='. . .' onChange={e => setCardCvv(e.target.value)} value={cardCvv} maxLength='3' autoComplete='none' />
//       </div>
//     </div>
//   </div>
//   <div className='text-center mt-4'>
//     {
//       result.status &&
//       <small className={`text-${result.status === 200 ? 'violet' : 'danger'} my-2`}>
//         {result.message} <br/>
//       </small>
//     }
//     <button className='btn btn-sm btn-violet-rounded col-5' onClick={saveRecharge}>
//       Recharge
//     </button>
//   </div>
// </div>
