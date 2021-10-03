import React from 'react'
import { Link } from 'react-router-dom'

function InvoiceComponent ({ currentUser, wallet, displayPost, setStepNumber }) {
  const handleUpdate = () => {
    setStepNumber(2)
  }

  return (
    <div className='container desktop-align-center trade-post-wrapper mt-5 mt-sm-0'>
      <img src={require('assets/svgs/StepOne.svg').default} className='' alt='Visibility' />
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
              <td className='key'>Asset price</td>
              <td className='value'>
                <img src={require('assets/svgs/currency/inr_black.svg').default} className='inr-black-icon' alt='Inr' />
                {displayPost.tradePrice}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {
        (!wallet.amount || (wallet.amount < displayPost.tradePrice))
          ? <div className='recharge-section'>
            <small className='text-danger'>Your wallet has insufficient balance. Recharge to proceed.</small><br/>
            <Link to='/app/recharge' className='btn btn-sm btn-violet-rounded col-5'>Recharge</Link>
          </div>
          : <button className='btn btn-sm btn-link text-black align-self-center' onClick={handleUpdate}>Next <img src={require('assets/svgs/AngleRightDark.svg').default} className='inr-black-icon' alt='Inr' /></button>
      }
    </div>
  )
}

export default InvoiceComponent
