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
  const routes = []

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
    history.push('/app/posts')
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

  return (
    <div onKeyDown={e => handleKeyDown(e)}>
      <StaticHeaderComponent routes={routes} />
      <div className='login-form'>
        <h4 className='page-header'>Login</h4>
        <div>
          <div className='form-group'>
            <label>Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              name='email'
              type='email'
              className='form-control'
              placeholder='Enter email'
              autoFocus={true}
            />
          </div>
          <div className='form-group input-password'>
            <label>Password</label>
            <input
              onChange={e => setPassword(e.target.value)}
              name='password'
              value={password}
              type='password'
              className='form-control'
              id='loginPass'
              placeholder='Enter password'
            />
            <i className={`fa ${eyeIcon} show-password`} onClick={e => showPassword()}></i>
          </div>
          {error && <div className='text-danger text-center mt-3'>{error}</div>}
          <button className='btn btn-sm btn-violet col-12 my-4' disabled={btnSave !== 'Submit'} onClick={e => handleForm(e)}>{btnSave}</button>
          <div className='d-flex page-opts'>
            <Link to='/forgot_password' className='flex-grow-1'>Forgot password</Link> <br/>
            <Link to='/signup'>New User? Sign up</Link> <br/>
          </div>
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
