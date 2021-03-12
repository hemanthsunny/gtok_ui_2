import React, { useState, useEffect } from 'react'

const NoInternetNotification = () => {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    function isOnline () {
      // const xml = new XMLHttpRequest()
      // return new Promise((res, rej) => {
      //   xml.onload = () => {
      //     setOnline(true)
      //     res(true)
      //   }
      //   xml.onerror = () => {
      //     setOnline(false)
      //     rej(false)
      //   }
      //   xml.open('GET', 'https://www.google.com/', true)
      //
      //   xml.setRequestHeader('Content-Type', 'application/json')
      //   xml.setRequestHeader('Accept', 'application/json')
      //   xml.setRequestHeader('Origin', 'http://localhost:3000')
      //   xml.send()
      // })
      setOnline(true)
    }

    if (!online) isOnline()
  }, [online])

  return (
    <div className={`notification alert fade show alert-danger ${online && 'd-none'}`}>
      No Internet
    </div>
  )
}

export default NoInternetNotification
