import React from 'react'

function ConfirmComponent ({ wallet, currentUser, save, displayPost, loading, passcode, setPasscode, result, setResult }) {
  const handlePasscode = (val) => {
    setResult({})
    setPasscode(val)
  }

  return (
    <div className='container desktop-align-center trade-post-wrapper'>
      <div className='pt-3'>
        <img src={require('assets/svgs/StepTwo.svg').default} className='' alt='Visibility' />
      </div>
      <h5 className='pt-5'>Enter wallet passcode</h5>
      <div className='enter-passcode-section'>
        <div className='passcode-card'>
          <input type='password' className='passcode-input' placeholder='....' onChange={e => handlePasscode(e.target.value)} maxLength='4' autoComplete='off' />
        </div>
        <div className='text-center'>
          {
            result.status &&
            <div className={`text-${result.status === 200 ? 'violet' : 'danger'} mt-3`}>
              <small>{result.message}</small>
            </div>
          }
        </div>
        <button className='btn btn-violet-rounded btn-sm col-5 submit-passcode' disabled={(passcode.length !== 4) || loading} onClick={save}>
          {
            loading
              ? <span>
                Paying... &nbsp;
                <div className='spinner-border spinner-border-sm' role='status'>
                  <span className='sr-only'>Paying...</span>
                </div>
              </span>
              : <span>
              Pay <img src={require('assets/svgs/currency/inr.svg').default} className='currency-icon' alt='Inr' /> {displayPost.tradePrice}
              </span>
          }
        </button>
      </div>
    </div>
  )
}

export default ConfirmComponent
