import React, { useState } from 'react'

function PayoutComponent ({
  currentUser, wallet, setStepNumber, withdrawAmount, setWithdrawAmount, accountName, setAccountName, accountNumber, setAccountNumber, ifscCode, setIfscCode
}) {
  const [withdrawAmountAlerts, setWithdrawAmountAlerts] = useState('')
  const [disableBtn, setDisableBtn] = useState(!(withdrawAmount && accountName && accountNumber && ifscCode))

  const handleWithdrawAmount = (val) => {
    setWithdrawAmount(val)
    if (val > +wallet.amount) {
      setWithdrawAmountAlerts({
        message: 'Insufficient wallet balance',
        classname: 'withdraw-danger-alert'
      })
      setDisableBtn(true)
    } else if (val < 500) {
      setWithdrawAmountAlerts({
        message: 'Minimum amount for a withdrawal request is INR 500/-',
        classname: 'withdraw-danger-alert'
      })
      setDisableBtn(true)
    } else if (val > 500) {
      setWithdrawAmountAlerts({
        message: '15% service fee & other taxes will be included',
        classname: 'withdraw-success-alert'
      })
      setDisableBtn(false)
    } else if (val > 100000) {
      setWithdrawAmountAlerts({
        message: 'You cannot withdraw more than INR 100,000/- in a single withdrawal request',
        classname: 'withdraw-danger-alert'
      })
      setDisableBtn(true)
    } else {
      setWithdrawAmountAlerts('')
      setDisableBtn(false)
    }
  }

  return (
    <div className='container desktop-align-center trade-post-wrapper'>
      <div className='pt-5'>
        <img src={require('assets/svgs/StepOne.svg').default} className='' alt='Visibility' />
      </div>
      <div className='wallet-withdraw-wrapper desktop-align-center'>
        <div className=''>
          <div className=''>
            <div className='form-group'>
              <label className='form-label recharge-amount-label'>Withdraw amount</label>
              <input type='number' className='form-control recharge-amount col-6' placeholder='INR' onChange={e => handleWithdrawAmount(e.target.value)} value={withdrawAmount} />
              {
                !!withdrawAmountAlerts &&
                  <div className={`${withdrawAmountAlerts.classname}`}>
                    {withdrawAmountAlerts.message}
                  </div>
              }
            </div>
            <h6 className='my-4'>Payee details</h6>
            <div className='form-group'>
              <label className='form-label'>Account name</label>
              <input type='text' className='form-control' placeholder='account holder name' onChange={e => setAccountName(e.target.value)} value={accountName} />
            </div>
            <div className='form-group'>
              <label className='form-label'>Account number</label>
              <input type='number' className='form-control' placeholder='account number' onChange={e => setAccountNumber(e.target.value)} value={accountNumber} />
            </div>
            <div className='form-group'>
              <label className='form-label'>IFSC code</label>
              <input type='text' className='form-control' placeholder='ex-SBIN......' onChange={e => setIfscCode(e.target.value)} value={ifscCode} autoComplete='none' />
            </div>
          </div>
          <div className='text-center mt-4'>
            <button className='btn btn-sm btn-violet-rounded col-8' disabled={disableBtn || !accountName || !accountNumber || !ifscCode} onClick={e => setStepNumber(2)}>
              Request Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PayoutComponent
