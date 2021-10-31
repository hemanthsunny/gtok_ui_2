import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { StaticHeaderComponent } from 'components'
import { sendForgotPassword } from 'firebase_config'

const ForgotPasswordComponent = () => {
  const [email, setEmail] = useState('')
  const [btnSave, setBtnSave] = useState('Send')
  const [result, setResult] = useState({})

  const handleForm = async (e) => {
    e.preventDefault()
    setBtnSave('Sending...')
    const res = await sendForgotPassword(email)
    setResult(res)
    if (res.status === 200) setBtnSave('Sent')
    else setBtnSave('Send')
  }

  const redirectTo = () => {
    window.open('https://letsgtok.com', '_blank')
  }

  return (
    <div className='forgot-pw-page' id="forgot_pw">
      <StaticHeaderComponent />
      <div className='container login-form'>
        <div className='row'>
          <div className='col-12 right-block'>
            <div className='header'>
              <Link to='/login' className='float-left pl-3'>
                <img src={require('assets/svgs/forgot_pw/go_back.svg').default} alt='Go back' />
              </Link>
              <div className='clearfix'></div>
              <img src={require('assets/svgs/forgot_pw/header.svg').default} className='header' alt='Header' />
            </div>
            <div className='body'>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">
                    <div><img className="mail-icon" src={require('assets/svgs/login/right_mail_icon.svg').default} alt='Header' /></div>
                  </span>
                </div>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  name='email'
                  type='email'
                  className='form-control'
                  placeholder='Email'
                  autoFocus={true}
                  aria-label="email"
                  aria-describedby="basic-addon1"
                />
              </div>
              <div>
                <button className='btn login-btn col-12' disabled={btnSave !== 'Send' || !email} onClick={e => handleForm(e)}>{btnSave}</button>
              </div>
              {
                result.status && <div className={`text-center mt-3 ${result.status === 200 ? 'text-violet' : 'text-danger'}`}>{result.message}</div>
              }
            </div>
          </div>
        </div>
        <div className='footer'>
          <div className='d-flex justify-content-around'>
            <div className='pointer' onClick={redirectTo}>
              About us
            </div>
            <div className='pointer' onClick={redirectTo}>
              Blogs
            </div>
            <div className='pointer' onClick={redirectTo}>
              Contact
            </div>
          </div>
          <div className='company-name'>Lets Gtok Limited &copy;</div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordComponent
