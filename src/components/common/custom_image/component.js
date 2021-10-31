import React from 'react'
import './style.css'

const CustomImageComponent = ({ user, size, style }) => {
  return (
    <div>
      {
        user.photoURL
          ? <img src={user.photoURL} alt={user.displayName ? user.displayName.charAt(0) : 'LG'} className={`custom-image -${size}`} style={style} />
          : <div className={`custom-image-text text-capitalize -${size}`} style={style}>{user.displayName ? user.displayName.charAt(0) : 'LG'}</div>
      }
    </div>
  )
}

export default CustomImageComponent
