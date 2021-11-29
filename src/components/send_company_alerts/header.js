import React from 'react'
import { Link } from 'react-router-dom'

const HeaderComponent = ({ save, loading }) => {
  return (
    <nav className='navbar fixed-top fixed-top-lg navbar-violet-md px-4'>
      <Link to='/app/settings'>
        <img src={require('assets/svgs/Cross.svg').default} className='cross-icon' alt='LeftArrow' />
      </Link>
      <div className='navbar-brand mr-auto pt-2'>
        &nbsp; &nbsp; Send company alerts
      </div>
      <ul className='navbar-nav ml-auto'>
        <li className='nav-item'>
          <div className='nav-link p-0 text-white fw-500' onClick={save} disabled={loading}>
            {loading
              ? <div className='spinner-border spinner-border-sm' role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
              : 'Send'}
          </div>
        </li>
      </ul>
    </nav>
  )
}

export default HeaderComponent
