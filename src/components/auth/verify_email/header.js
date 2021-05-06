import React from 'react'
import { Link } from 'react-router-dom'

const HeaderComponent = ({ routes }) => {
  return (
    <nav className='navbar fixed-top header'>
      <div className='container-fluid'>
        <div className='navbar-brand mr-auto'>
          <Link to='/posts'>
            <span className='home-page-title'>Lets Gtok</span>
          </Link>
        </div>
        <ul className='navbar-nav ml-auto'>
          <li className='nav-item'>
            <div className='nav-link p-0'>
              <Link to='/'>Search</Link>
              <Link to='/'>Notifications</Link>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default HeaderComponent
