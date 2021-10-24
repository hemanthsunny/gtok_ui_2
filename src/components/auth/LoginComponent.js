import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import { signin } from 'firebase_config'
import { SetReload } from 'store/actions'
import { StaticHeaderComponent } from 'components'

const LoginComponent = ({ bindReload }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [btnSave, setBtnSave] = useState('Submit')
  const [error, setErrors] = useState('')
  const [eyeIcon, setEyeIcon] = useState('fa-eye')
  const history = useHistory()

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleForm(event)
    }
  }

  const handleForm = async (e) => {
    e.preventDefault()

    setBtnSave('Submitting...')
    const result = await signin({ email, password })
    setBtnSave('Submit')
    if (result.status !== 200) {
      setErrors(result.message)
      return
    }
    bindReload(true)
    history.push('/app/assets')
  }

  const showPassword = () => {
    const input = document.getElementById('loginPass')
    if (input.type === 'password') {
      setEyeIcon('fa-eye-slash')
      input.type = 'text'
    } else {
      setEyeIcon('fa-eye')
      input.type = 'password'
    }
  }

  const redirectTo = () => {
    window.open('https://letsgtok.com', '_blank')
  }

  return (
    <div className='login-page' onKeyDown={e => handleKeyDown(e)} id="login">
      <StaticHeaderComponent />
      <div className='container login-form'>
        <div className='row'>
          <div className='col-12 order-2 order-sm-1 col-sm-6 left-block'>
            <div className='header text-center'>
              <img src={require('assets/svgs/login/left_header.svg').default} className='col-12 header' alt='Header' />
            </div>
            <div className='row justify-content-around body pb-5 mb-4 pb-sm-0 mb-sm-0'>
              <img src={require('assets/svgs/login/left_infographic.svg').default} className='col-6 infographic' alt='Infographic' />
              <img src={require('assets/svgs/login/left_learn_more.svg').default} className='col-6 learn-more' alt='Learn more' onClick={redirectTo} />
            </div>
          </div>
          <div className='col-12 order-1 order-sm-2 col-sm-6 right-block'>
            <div className='header text-center'>
              <img src={require('assets/svgs/login/right_header.svg').default} className='header' alt='Header' />
            </div>
            <div className='body'>
              <div className="input-group mb-2">
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
              <div className="input-group mb-2">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon2">
                    <div><img src={require('assets/svgs/login/right_lock_icon.svg').default} alt='Header' /></div>
                  </span>
                </div>
                <input
                  onChange={e => setPassword(e.target.value)}
                  name='password'
                  value={password}
                  type='password'
                  className='form-control'
                  id='loginPass'
                  placeholder='Password'
                  aria-label='password'
                  aria-describedby='basic-addon2'
                />
                <div className="input-group-append">
                  <span className="input-group-text append" id="basic-addon3" onClick={e => showPassword()}>
                    {
                      eyeIcon === 'fa-eye'
                        ? <img className='show-password' src={require('assets/svgs/Eye.svg').default} alt='Eye' />
                        : <img className='show-password' src={require('assets/svgs/EyeOpen.svg').default} alt='EyeOpen' />
                    }
                  </span>
                </div>
              </div>
              <div className='text-center pt-2'>
                <div className='ml-auto'>
                  <Link to='/forgot_password' className='forgot-pw'>
                    Forgot password
                  </Link>
                </div>
              </div>
              <div>
                <button className='btn login-btn col-12' disabled={btnSave !== 'Submit'} onClick={e => handleForm(e)}>Login to your account</button><br/>
                <Link to='/signup' className='signup-btn'>Sign up</Link>
              </div>
              {error && <div className='text-danger text-center mt-3'>{error}</div>}

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

const mapDispatchToProps = (dispatch) => {
  return {
    bindReload: (content) => dispatch(SetReload(content))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(LoginComponent)
