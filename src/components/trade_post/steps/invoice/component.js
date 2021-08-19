import React from 'react'
import { connect } from 'react-redux'

function InvoiceComponent ({ currentUser, wallet, passcodeState, setPasscodeState, setStepNumber }) {
  const handleChange = (key, val) => {
    setPasscodeState({ ...passcodeState, [key]: val })
  }

  const handleUpdate = () => {
    setStepNumber(2)
  }

  return (
    <div className='change-pc-wrapper desktop-align-center'>
      <div className='text-center my-4'>
        <img src={require('assets/svgs/StepOne.svg').default} className='' alt='Visibility' />
      </div>
      <div className={`form-group ${wallet.length < 1 && 'd-none'}`}>
        <label className='form-label'>Old passcode</label>
        <input type='number' className='form-control' id='oldPc' maxLength='4' onChange={e => handleChange('oldPc', e.target.value)} placeholder='xxxx' value={passcodeState.oldPasscode}/>
      </div>
      <div className='form-group'>
        <label className='form-label'>New passcode</label>
        <input type='number' className='form-control' id='newPc' maxLength='4' onChange={e => handleChange('newPc', e.target.value)} placeholder='xxxx' value={passcodeState.newPasscode}/>
      </div>
      <div className='form-group'>
        <label className='form-label'>Confirm passcode</label>
        <input type='number' className='form-control' id='confirmPc' maxLength='4' onChange={e => handleChange('confirmPc', e.target.value)} placeholder='xxxx' value={passcodeState.confirmPasscode}/>
      </div>
      <button className='btn btn-violet-rounded col-6' onClick={handleUpdate}>
        Update
      </button>
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
)(InvoiceComponent)
