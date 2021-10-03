import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import moment from 'moment'
import './style.css'

import HeaderComponent from './header.js'
import InvoiceComponent from './steps/invoice/component'
import ConfirmComponent from './steps/confirm/component'
import { CustomImageComponent } from 'components'
import { getId, getQuery, firestore } from 'firebase_config'
import { post } from 'services'

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
    let pos
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        pos = `${position.coords.latitude},${position.coords.longitude}`
      })
    }
    const res = await post('/transaction/exchange', {
      postId: postId,
      latLong: pos
    })

    setLoading(false)
    setResult(res)
    if (res.status === 201) {
      toast.success(`You've successfully traded @${postedUser.username} asset`)
      history.push({
        pathname: `/app/posts/${displayPost.id}`,
        state: {
          traded: true,
          result
        }
      })
    } else {
      toast.error('Something went wrong. Try later')
    }
  }

  return (
    <div>
      <HeaderComponent />
      <div className='dashboard-content pt-4 mt-md-5'>
        {loading && <div onClick={saveTransaction}>Save</div>}
        <div className='d-flex ml-2 mt-4 mt-md-5'>
          <div className=''>
            {displayPost.anonymous
              ? <CustomImageComponent user={postedUser} size='sm' />
              : <CustomImageComponent user={postedUser} size='sm' />
            }
          </div>
          <div className='card post-card-wrapper add-filter'>
            {
              displayPost && displayPost.stories.map((story, idx) => (
                <div key={idx}>
                  <div className='card-body'>
                    <div>
                      <span className='card-badge'>{displayPost.category.title}</span>
                      <span className='created-at'>{moment(displayPost.createdAt).format('h:mm A')} &middot; {moment(displayPost.createdAt).format('MMMM DD, YYYY')}</span>
                    </div>
                    <div className='clearfix'></div>
                    <div className='card-body hidden-post'>
                      <div className='blur-text'>
                        This is a trading post. Trade it, to unlock.
                      </div>
                      <div className='locked-post'>
                        <div className='locked-post-text'>
                          Trade for <img className='inr-icon' src={require('assets/svgs/currency/inr_violet.svg').default} alt="1" />{displayPost.tradePrice}
                        </div>
                        <div>
                          <img src={require('assets/svgs/LockedPost.svg').default} className='locked-post-icon' alt="1" />
                        </div>
                      </div>
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
        { stepNumber === 2 && <ConfirmComponent currentUser={currentUser} displayPost={displayPost} wallet={wallet} setStepNumber={setStepNumber} save={saveTransaction} loading={loading} /> }
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
