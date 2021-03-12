import React from 'react'
import { Link } from 'react-router-dom'
import { signout } from 'firebase_config'

const ErrorComponent = (props) => {
  const signoutUser = async () => {
    await signout()
    window.location.reload()
  }

  return (
    <div className='alert alert-info'>
      {props.error}
      400 error
      <Link to='/'> Go Home </Link>
      <button className='btn btn-outline-danger' onClick={e => signoutUser()}> Logout </button>
    </div>
  )
}

export default ErrorComponent
