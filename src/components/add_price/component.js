import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import HeaderComponent from './header'

import { add } from 'firebase_config'

function AddPriceComponent ({ currentUser, prices }) {
  // const [priceExists, setPriceExists] = useState(false)
  const [price, setPrice] = useState(0)
  const [result, setResult] = useState('')
  const history = useHistory()

  useEffect(() => {
    if (prices[0]) {
      // setPriceExists(false)
      setPrice(prices[0].amount)
    }
  }, [setPrice, prices])

  const savePrice = async () => {
    if (!price || !price.toString().match('^[0-9]+$')) {
      alert('Invalid price')
      return null
    }

    const data = {
      amount: +price,
      premium: 'posts',
      userId: currentUser.id
    }
    const result = await add('prices', data)
    /* Log the activity */
    // await add('logs', {
    //   text: `${currentUser.displayName} posted an activity`,
    //   userId: currentUser.id,
    //   collection: 'paymentCards',
    //   timestamp
    // });
    if (result.status === 200) {
      history.push({
        pathname: '/app/profile'
      })
    } else {
      setResult(result)
    }
  }

  return (
    <div>
      <HeaderComponent save={savePrice} />
      <div className='container add-price-wrapper'>
        <div className='form-group row'>
          <label htmlFor='price' className='col-sm-4 form-label'>
            For your premium posts, set the price. The price has to be INR. On a monthly basis, users will be billed.
          </label>
          <div className='input-group mb-3 col-12'>
            <div className='input-group-prepend'>
              <span className='input-group-text' id='currency'>INR</span>
            </div>
            <input type='number' className='form-control' id='price' value={price} placeholder='Enter integers only. Ex: 100, 200' onChange={e => setPrice(e.target.value)} min={1} required />
          </div>
        </div>
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

const mapStateToProps = (state) => {
  const { prices } = state.prices
  return { prices }
}

export default connect(
  mapStateToProps,
  null
)(AddPriceComponent)
