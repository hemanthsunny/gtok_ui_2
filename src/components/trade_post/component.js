import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import './style.css'

import HeaderComponent from './header.js'
import InvoiceComponent from './steps/invoice/component'
import ConfirmComponent from './steps/confirm/component'
import { CustomImageComponent } from 'components'
import { getId, getQuery, firestore, add, update } from 'firebase_config'

function TradePostComponent (props) {
  const { currentUser } = props
  const [result, setResult] = useState('')
  const [displayPost, setDisplayPost] = useState('')
  const [postedUser, setPostedUser] = useState('')
  const postId = props.computedMatch.params.post_id
  const [loading, setLoading] = useState(false)
  const [wallet, setWallet] = useState(props.wallet[0])
  const [stepNumber, setStepNumber] = useState(1)
  const history = useHistory()

  useEffect(() => {
    async function getPost () {
      let p = await getId('posts', postId)
      p = Object.assign(p, { id: postId })
      const u = await getId('users', p.userId)
      setDisplayPost(p)
      setPostedUser(u)
    }

    if (postId) {
      getPost()
    }

    // get walletDetails
    async function getWalletDetails () {
      const w = await getQuery(
        firestore.collection('wallets').where('userId', '==', currentUser.id).get()
      )
      setWallet(w[0])
    }

    if (!wallet) {
      getWalletDetails()
    }
  }, [postId, wallet])

  const saveTransaction = async () => {
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
      currency: currentUser.currency || 'inr',
      tradePrice: displayPost.tradePrice,
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
    }
    /* Call API here */
    // API 1: create a transaction
    // API 2: debit amount from current user wallet
    // API 3: credit amount to posted user wallet
    // API 4: display the post completely

    // API 1
    await update('wallets', wallet.id, { amount: (wallet.amount - displayPost.tradePrice) })

    // API 2
    const sellerWallet = await getQuery(
      firestore.collection('wallets').where('userId', '==', displayPost.userId).limit(1).get()
    )
    await update('wallets', sellerWallet[0].id, { amount: (wallet.amount + displayPost.tradePrice) })
    const res = await add('transactions', data)

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
    if (res.status === 200) {
      history.push({
        pathname: `/app/posts/${displayPost.id}`,
        state: {
          traded: true,
          result
        }
      })
    }
  }

  return (
    <div>
      <HeaderComponent />
      {loading && <div onClick={saveTransaction}>Save</div>}
      <div className='d-flex ml-2 mt-5 pt-3 mb-4'>
        <div className=''>
          {displayPost.anonymous
            ? <CustomImageComponent user={postedUser} size='sm' />
            : <CustomImageComponent user={postedUser} size='sm' />
          }
        </div>
        <div className='card post-card-wrapper'>
          {
            displayPost && displayPost.stories.map((story, idx) => (
              <div key={idx}>
                <div className='card-body'>
                  <div>
                    <span className='card-badge'>{displayPost.category.title}</span>
                    <span className='created-at'>{moment(displayPost.createdAt).format('h:mm A')} &middot; {moment(displayPost.createdAt).format('MMMM DD, YYYY')}</span>
                  </div>
                  <div className='clearfix'></div>
                  <div>
                    <p className='card-text white-space-preline'>
                      {story.text.substring(0, 25)} . . .
                    </p>
                  </div>
                </div>
                <div className='card-footer'>
                  <span className='author pointer'>@{postedUser.username}</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      { stepNumber === 1 && <InvoiceComponent currentUser={currentUser} displayPost={displayPost} wallet={wallet} setStepNumber={setStepNumber} /> }
      { stepNumber === 2 && <ConfirmComponent currentUser={currentUser} displayPost={displayPost} wallet={wallet} setStepNumber={setStepNumber} save={saveTransaction} /> }
    </div>
  )
}

const mapStateToProps = (state) => {
  const { wallet } = state.wallet
  return { wallet }
}

export default connect(
  mapStateToProps,
  null
)(TradePostComponent)
