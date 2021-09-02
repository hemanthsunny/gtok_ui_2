import React from 'react'

function InvoiceComponent ({
  currentUser, wallet, setStepNumber, withdrawAmount, accountName, accountNumber, ifscCode, save
}) {
  const totalWithdrawAmount = withdrawAmount - (0.15 * withdrawAmount) - (0.05 * withdrawAmount)
  return (
    <div className='container desktop-align-center'>
      <div className='wallet-withdraw-wrapper desktop-align-center'>
        <h5 className='step-header'>
          <div className='header-img'>
            <img src={require('assets/svgs/StepTwo.svg').default} className='' alt='Visibility' />
          </div>
          <div className='header-text'>
          Invoice details
          </div>
        </h5>
        <div className=''>
          <div className=''>
            <div className='invoice-table'>
              <div className='d-flex flex-row justify-content-between invoice-table-section font-bold'>
                <div className='key'>Wallet amount</div>
                <div className='value'>
                  <img src={require('assets/svgs/currency/inr_black.svg').default} className='inr-black-icon' alt='Inr' />
                  {wallet.amount || 0}
                </div>
              </div>
              <hr className='invoice-table-divider'/>
              <div className='d-flex flex-row justify-content-between invoice-table-section'>
                <div className='key'>Withdrawal amount</div>
                <div className='value'>
                  <img src={require('assets/svgs/currency/inr_black.svg').default} className='inr-black-icon' alt='Inr' />
                  {withdrawAmount || 500}
                </div>
              </div>
              <hr className='invoice-table-divider'/>
              <div className='d-flex flex-column invoice-table-section'>
                <div className='col-header'>Taxes & Fees</div>
                <div className='d-flex flex-row justify-content-between'>
                  <div className='key'>Service Fees (15%)</div>
                  <div className='value'>
                    <img src={require('assets/svgs/currency/inr_black.svg').default} className='inr-black-icon' alt='Inr' />
                    {0.15 * withdrawAmount}
                  </div>
                </div>
                <div className='d-flex flex-row justify-content-between'>
                  <div className='key'>Other taxes (5%)</div>
                  <div className='value'>
                    <img src={require('assets/svgs/currency/inr_black.svg').default} className='inr-black-icon' alt='Inr' />
                    {0.05 * withdrawAmount}
                  </div>
                </div>
              </div>
              <hr className='invoice-table-divider'/>
              <div className='d-flex flex-row justify-content-between invoice-table-section font-bold'>
                <div className='key'>Total withdrawal amount</div>
                <div className='value'>
                  <img src={require('assets/svgs/currency/inr_black.svg').default} className='inr-black-icon' alt='Inr' />
                  {totalWithdrawAmount || 0}
                </div>
              </div>
              <hr className='invoice-table-divider'/>
              <div className='d-flex flex-column invoice-table-section'>
                <div className='d-flex flex-row justify-content-between'>
                  <div className='col-header'>Payee details</div>
                  <div className='btn-sm btn-violet-outline value' onClick={e => setStepNumber(1)}>
                    Edit
                  </div>
                </div>
                <div className='d-flex flex-row'>
                  <div className='value text-left'>
                    <span className='text-uppercase'>{accountName}</span> <br/>
                    {accountNumber} &middot; {ifscCode}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='text-center mt-4'>
            <button className='btn btn-sm btn-violet-rounded col-5' onClick={save}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceComponent
