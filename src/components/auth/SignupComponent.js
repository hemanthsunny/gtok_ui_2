import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { signup, add, getQuery, firestore } from 'firebase_config'
import { StaticHeaderComponent } from 'components'
import { validateEmail } from 'helpers'

const SignupComponent = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tnc, setTnc] = useState(false)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [btnSave, setBtnSave] = useState('Submit')
  const [error, setErrors] = useState('')
  const [eyeIcon, setEyeIcon] = useState('fa-eye')
  const history = useHistory()

  const handleForm = async (e) => {
    e.preventDefault()
    if (!username || !username.trim()) {
      setErrors('Username is mandatory')
      return null
    }
    if (username && !username.match('^[a-z 1-9 _]+$')) {
      setErrors('Only alphanumeric values are accepted as username')
      return null
    }

    const data = {
      username: username.toLowerCase().replace(/ /g, '_'),
      displayName: username.toLowerCase().replace(/_/g, ' ')
    }
    // Verify username in database
    const user = await getQuery(
      firestore.collection('users').where('username', '==', data.username).get()
    )
    if (user[0]) {
      setErrors('Username is already in use. Attempt anything new.')
      return null
    }
    if (!email || !email.trim()) {
      setErrors('Email is mandatory')
      return null
    }
    if (email && !validateEmail(email)) {
      setErrors('Enter a valid email')
      return null
    }
    if (!password || !password.trim()) {
      setErrors('Password is mandatory')
      return null
    }
    if (!tnc) {
      setErrors('Agree to our Terms and conditions')
      return null
    }
    setBtnSave('Submitting...')
    await signup({ email, password, data })
    const userData = {
      email,
      followers: [],
      username: data.username,
      permissions: {
        tnc,
        recordPageVisits: true,
        locationAccess: true,
        emailUpdates
      },
      photoURL: null,
      verifyEmailSentTime: new Date()
    }
    const createDbUser = await add('users', userData)
    setBtnSave('Submit')
    if (createDbUser.status !== 200) {
      setErrors(createDbUser.message)
      return null
    }
    history.push('/')
  }

  const showPassword = () => {
    const input = document.getElementById('signupPass')
    if (input.type === 'password') {
      setEyeIcon('fa-eye-slash')
      input.type = 'text'
    } else {
      setEyeIcon('fa-eye')
      input.type = 'password'
    }
  }

  return (
    <div >
      <StaticHeaderComponent />
      <div className='login-form'>
        <h4 className='page-header mb-4'>Signup</h4>
        <div>
          <div className='form-group'>
            <label>Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value.toLowerCase())}
              name='name'
              type='text'
              className='form-control'
              placeholder='lets_gtok_user_name'
            />
          </div>
          <div className='form-group'>
            <label>Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              name='email'
              type='email'
              className='form-control'
              placeholder='Enter email'
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
              id='signupPass'
              placeholder='Atleast 6 letters required'
            />
            <i className={`fa ${eyeIcon} show-password`} onClick={e => showPassword()}></i>
          </div>
        {/*
          <div className='d-flex'>
            <div className='custom-switch mb-2'>
              <input type='checkbox' className='custom-control-input' id='tnc' name='tnc' onChange={e => setTnc(!tnc)} checked={tnc} />
              <label className='custom-control-label text-left' htmlFor='tnc'>
                <small>Agree to our Terms and Conditions.</small>
              </label>
            </div>
          </div>
        */}
          <div className='permissions'>
            <div className='form-check'>
              <input type='checkbox' className='form-check-input' id='tnc' name='tnc' onChange={e => setTnc(!tnc)} checked={tnc} />
              <label className='form-check-label' htmlFor='tnc'>
                I'm at least 16 years old. Accept our <a href='https://letsgtok.com/tnc' target='_blank' rel='noopener noreferrer' className='text-violet'>Terms of service</a>, and our  <a href='https://letsgtok.com/privacy_policy' target='_blank' rel='noopener noreferrer' className='text-violet'>Privacy policy</a>.
              </label>
            </div>
            <div className='form-check mt-2'>
              <input type='checkbox' className='form-check-input' id='emailUpdates' name='emailUpdates' onChange={e => setEmailUpdates(!emailUpdates)} checked={emailUpdates} />
              <label className='form-check-label' htmlFor='emailUpdates'>
                I'd like to be notified by email.
              </label>
            </div>
          </div>
          {error && <div className='text-danger text-center mt-3'>{error}</div>}
          <button className='btn btn-sm btn-violet col-12 my-4' disabled={btnSave !== 'Submit'} onClick={e => handleForm(e)}>{btnSave}</button>
          <div className='d-flex page-opts'>
            <Link to='/login' className='flex-grow-1'>Already a user? Login</Link>
            <Link to='/forgot_password'>Forgot password</Link> <br/>
          </div>
        </div>
      </div>
    <br/>
    {/*
      <button onClick={() => handleGoogleLogin()} class='googleBtn' type='button'>
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'
          alt='logo'
        />
        Join With Google
      </button>
    */}
    </div>
  )
}

export default SignupComponent
