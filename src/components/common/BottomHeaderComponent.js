import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { Metadata } from 'constants/index'
import { HelmetMetaDataComponent } from 'components'

const BottomHeaderComponent = ({
  currentUser,
  newMessagesCount,
  newAlertsCount
}) => {
  const [metaDetails, setMetaDetails] = useState({})

  useEffect(() => {
    const path = window.location.pathname
    if (path.includes('/app/chats')) {
      setMetaDetails(Metadata['/app/chats'])
    } else if (path.includes('/app/similarities')) {
      setMetaDetails(Metadata['/app/similarities'])
    } else if (path.includes('/app/profile')) {
      setMetaDetails(Metadata['/app/profile'])
    } else if (path.includes('/app/create_asset')) {
      setMetaDetails(Metadata['/app/create_asset'])
    } else {
      setMetaDetails(Metadata[path || 'default'])
    }
  }, [metaDetails, currentUser])

  return (
    <div>
      {
        metaDetails && metaDetails.title &&
        <HelmetMetaDataComponent title={metaDetails.title} keywords={metaDetails.keywords} description={metaDetails.description}/>
      }
      <div className='d-flex flex-row navbar-bottom align-items-center align-self-center justify-content-around'>
        <div className='nav-item ml-1' title='Home'>
          <div className='nav-link text-center'>
            <Link to='/app/assets'>
              <img src={(metaDetails && (metaDetails.path === 'posts' || metaDetails.path === 'activities')) ? require('assets/svgs/HomeActive.svg').default : require('assets/svgs/Home.svg').default} className='home-icon' alt='Home' />
            </Link>
          </div>
        </div>
        <div className='nav-item ml-1' title='Create post'>
          <div className='nav-link text-center'>
            <Link to='/app/create_asset'>
              <img src={(metaDetails && (metaDetails.path === 'create_post' || metaDetails.path === 'create_activity')) ? require('assets/svgs/PlusActive.svg').default : require('assets/svgs/Plus.svg').default} className='plus-c-icon' alt='Create post' />
            </Link>
          </div>
        </div>
        <div className='nav-item ml-1' title='Profile'>
          <div className='nav-link text-center'>
            <Link to='/app/profile'>
              <img src={(metaDetails && metaDetails.path === 'profile') ? require('assets/svgs/ProfileActive.svg').default : require('assets/svgs/Profile.svg').default} className='profile-icon' alt='Profile' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { newMessagesCount } = state.chatMessages
  const { newAlertsCount } = state.alerts
  return { newMessagesCount, newAlertsCount }
}

export default connect(
  mapStateToProps,
  null
)(BottomHeaderComponent)
