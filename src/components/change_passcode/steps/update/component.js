import React from 'react'

function UpdatePasscodeComponent ({ currentUser, wallet, passcodeState, setPasscodeState, setStepNumber, savePasscode }) {
  const handleChange = (key, val) => {
    setPasscodeState({ ...passcodeState, [key]: val })
  }

  const handleUpdate = () => {
    savePasscode()
  }

  return (
    <div className='change-pc-wrapper desktop-align-center enter-passcode-section'>
      <div className='text-center my-4'>
        <img src={require('assets/svgs/StepOne.svg').default} className='' alt='Visibility' />
      </div>
      <div className={`form-group ${wallet.length < 1 && 'd-none'}`}>
        <label className='form-label'>Old passcode</label>
        <div className='passcode-card'>
          <input type='password' className='passcode-input' placeholder='....' onChange={e => handleChange('oldPasscode', e.target.value)} value={passcodeState.oldPasscode} />
        </div>
      </div>
      <div className='form-group'>
        <label className='form-label'>New passcode</label>
        <div className='passcode-card'>
          <input type='password' className='passcode-input' placeholder='....' onChange={e => handleChange('newPasscode', e.target.value)} value={passcodeState.newPasscode} maxLength='4' />
        </div>
      </div>
      <div className='form-group'>
        <label className='form-label'>Confirm passcode</label>
        <div className='passcode-card'>
          <input type='password' className='passcode-input' placeholder='....' onChange={e => handleChange('confirmPasscode', e.target.value)} value={passcodeState.confirmPasscode} maxLength='4' />
        </div>
      </div>
      <button className='btn btn-sm btn-violet-rounded col-6' onClick={handleUpdate}>
        {wallet ? 'Update' : 'Create'}
      </button>
    </div>
  )
}

export default UpdatePasscodeComponent
