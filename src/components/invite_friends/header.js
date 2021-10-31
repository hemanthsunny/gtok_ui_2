import React from 'react'
import { useHistory } from 'react-router-dom'

const HeaderComponent = () => {
  const history = useHistory()

  return (
    <nav className='navbar fixed-top fixed-top-lg navbar-violet-md px-4'>
      <div className='' onClick={e => history.push('/app/settings')}>
        <img src={require('assets/svgs/LeftArrowWhite.svg').default} className='go-back-icon' alt='LeftArrow' />
      </div>
      <div className='navbar-brand mr-auto pt-2'>
        Invite friends
      </div>
    </nav>
  )
}

export default HeaderComponent

// https://github.com/dannyradden/single-character-input-boxes
