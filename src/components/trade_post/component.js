import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import HeaderComponent from './header.js'
import './style.css'

import { CustomImageComponent } from 'components'
import { getId } from 'firebase_config'

function TradePostComponent (props) {
  const { currentUser, wallet } = props
  const [result, setResult] = useState('')
  const [displayPost, setDisplayPost] = useState('')
  const [postedUser, setPostedUser] = useState('')
  const postId = props.computedMatch.params.post_id
  const [loading, setLoading] = useState(false)
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
  }, [postId])

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
        pathname: '/app/posts/displayPost.id'
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
      <div className='container desktop-align-center trade-post-wrapper'>
        <div className='pt-3'>
          <img src={require('assets/svgs/StepOne.svg').default} className='' alt='Visibility' />
        </div>
        <h5 className='pt-5'>Invoice details</h5>
        <div className='invoice-table'>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <td className='key'>Wallet amount</td>
                <td className='value'>
                  <img src={require('assets/svgs/currency/inr_black.svg').default} className='inr-black-icon' alt='Inr' />
                  {wallet.amount || 0}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='key'>Purchase amount</td>
                <td className='value'>
                  <img src={require('assets/svgs/currency/inr_black.svg').default} className='inr-black-icon' alt='Inr' />
                  {displayPost.tradePrice}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {
          (!wallet[0].amount || (wallet[0].amount < displayPost.tradePrice))
            ? <div className='recharge-section'>
              <small className='text-danger'>Your wallet has insufficient balance. Recharge to proceed.</small><br/>
              <button className='btn btn-sm btn-violet-rounded col-5'>Recharge</button>
            </div>
            : <button className='btn btn-sm btn-link'>Next</button>
        }
      </div>
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
