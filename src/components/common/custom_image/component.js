import React from 'react'
import './style.css'

const CustomImageComponent = ({ user, size }) => {
  return (
    <div>
      {
        user.photoURL
          ? <img src={user.photoURL} alt={user.displayName ? user.displayName.charAt(0) : 'LG'} className={`custom-image ${size === 'lg' && '-lg'}`} />
          : <div className={`custom-image-text text-capitalize ${size === 'lg' && '-lg'}`}>{user.displayName ? user.displayName.charAt(0) : 'LG'}</div>
      }
    </div>
  )
}

export default CustomImageComponent
