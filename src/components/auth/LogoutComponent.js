import React from 'react'
import { Link } from 'react-router-dom'
import { StaticHeaderComponent } from 'components'

const LogoutComponent = () => (
  <div>
    <StaticHeaderComponent />
    <div className='login-form'>
      <h5 className='page-header'>Succesfully logged out.</h5>
      <div className='page-opts text-center'>
        <Link to='/login' className='flex-grow-1'>Login again</Link>
      </div>
    </div>
  </div>
)

export default LogoutComponent
