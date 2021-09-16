import React, { useState, useEffect } from 'react'
import './style.css'

import HeaderComponent from './header'
import { getQuery, firestore } from 'firebase_config'

function InviteFriendsComponent ({ currentUser }) {
  const inviteLink = `https://letsgtok.com/${currentUser.username}`
  const [copyText, setCopyText] = useState(false)
  const [invites, setInvites] = useState(0)

  useEffect(async () => {
    const i = await getQuery(
      firestore.collection('referals').where('invitedBy', '==', currentUser.username).get()
    )
    setInvites(i.length)
  }, [])

  const copyLink = () => {
    navigator.clipboard.writeText(`https://localhost:3000/signup/${currentUser.username}`)
    setCopyText(true)
    setTimeout(() => {
      setCopyText(false)
    }, 3000)
  }

  return (
    <div>
      <HeaderComponent />
      <div className='dashboard-content -xs-bg-none'>
        <div className='invite-friends-wrapper text-center'>
          <input type='text' className='lg-input' value={inviteLink} disabled/>
          <div className='my-3'>
            {
              copyText
                ? <div className='text-violet'>
                  Link is copied
                </div>
                : <div className='btn btn-violet-outline btn-sm' onClick={copyLink}>
                  Copy the invite link
                </div>
            }
          </div>
          <div>
            People joined by the link <br/>
            <h2 className='text-violet'>{invites || 0}</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InviteFriendsComponent
