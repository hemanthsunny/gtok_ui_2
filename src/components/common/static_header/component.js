import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'
import { Metadata } from 'constants/index'
import { gtokFavicon } from 'images'
import './index.css'

const StaticHeaderComponent = ({ routes }) => {
  const [metaDetails, setMetaDetails] = useState({})
  useEffect(() => {
    const path = window.location.pathname
    Object.keys(Metadata).map((key) => {
      if (key.includes(path)) {
        setMetaDetails(Metadata[key])
      }
      return key
    })
  }, [metaDetails])

  return (
    <div className='static-header'>
      <Helmet>
        <title>{metaDetails.title}</title>
        <meta name='description' content= {metaDetails.description}/>
        <meta name='keywords' content= {metaDetails.keywords} />
        <link rel='icon' type='image/png' href={gtokFavicon} sizes='16x16'/>
      </Helmet>
      <nav className='navbar fixed-top' style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
        <div className='container'>
          <div className='navbar-brand mx-auto'>
            <Link to='/posts'>
              <span className='home-page-title'>Lets Gtok</span>
            </Link>
          </div>
          <ul className='navbar-nav ml-auto d-none'>
            <li className='nav-item'>
              <div className='nav-link p-0'>
                {/*
                <Link to='/posts'>Feelings</Link>
                <Link to='/activities'>Activities</Link>
                */}
                {
                  routes && routes[0] && routes.map(r => (
                    <Link to={r.route} key={r.route}>{r.title}</Link>
                  ))
                }
              </div>
            </li>
          </ul>
        </div>
      </nav>

    </div>
  )
}

export default StaticHeaderComponent
