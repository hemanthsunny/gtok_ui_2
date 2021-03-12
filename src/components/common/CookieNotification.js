import React, { useState, useEffect } from 'react'

const CookieNotification = () => {
  const [cookie, setCookie] = useState(localStorage.getItem('cookieSeen'))

  useEffect(() => {
    if (cookie) { setCookie(localStorage.getItem('cookieSeen')) }
  }, [cookie])

  const closeCookieBanner = () => {
    localStorage.setItem('cookieSeen', 'shown')
    setCookie('shown')
  }

  return (
    <div className={`cookie-banner ${cookie ? 'd-none' : ''}`}>
      <p className='pb-0'>
        By using our website, you are agree to our cookie policy.
      </p>
      <button className='btn btn-sm p-1 btn-violet' onClick={e => closeCookieBanner()}>OK</button>
    </div>
  )
}

export default CookieNotification
