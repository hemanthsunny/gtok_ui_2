import React, { useState } from 'react'
import './style.css'

import HeaderComponent from './header'
import { changePassword } from 'firebase_config'

function ChangePasswordComponent ({ currentUser }) {
  const [eyeIcon, setEyeIcon] = useState('hide')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [result, setResult] = useState({})

  const showPassword = () => {
    const input = document.getElementById('newPass')
    const confirmInput = document.getElementById('confirmNewPass')
    if (input.type === 'password') {
      setEyeIcon('show')
      input.type = 'text'
      confirmInput.type = 'text'
    } else {
      setEyeIcon('hide')
      input.type = 'password'
      confirmInput.type = 'password'
    }
  }

  const updatePassword = async () => {
    console.log('res', newPassword, confirmNewPassword)
    if (!newPassword) {
      setResult({
        status: 400,
        message: 'New password should be filled'
      })
      return null
    }
    if (!confirmNewPassword) {
      setResult({
        status: 400,
        message: 'Confirm password should be filled'
      })
      return null
    }
    if (newPassword !== confirmNewPassword) {
      setResult({
        status: 400,
        message: 'Passwords didn\'t match'
      })
      return null
    }
    const res = await changePassword(newPassword)
    setResult(res)
    setTimeout(() => {
      setResult('')
      setNewPassword(null)
      setConfirmNewPassword(null)
    }, 3000)
  }

  return (
    <div>
      <HeaderComponent save={updatePassword}/>
      <div>
        <div className='dashboard-content -xs-bg-none'>
          <div className='change-pw-wrapper desktop-align-center'>
            <div className='form-group'>
              <label className='form-label'>New Password</label>
              <input type='password' className='form-control' id='newPass' onChange={e => setNewPassword(e.target.value)} placeholder='New password'/>
              <img src={(eyeIcon === 'hide') ? require('assets/svgs/Eye.svg').default : require('assets/svgs/EyeOpen.svg').default} className='pw-visibility-icon' alt='Visibility' onClick={e => showPassword()} />
            </div>
            <div className='form-group'>
              <label className='form-label'>Confirm Password</label>
              <input type='password' className='form-control' id='confirmNewPass' onChange={e => setConfirmNewPassword(e.target.value)} placeholder='Confirm new password'/>
            </div>
            <div className='text-center'>
              {
                result.status &&
                <div className={`text-${result.status === 200 ? 'violet' : 'danger'} my-2`}>
                  {result.message}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordComponent
