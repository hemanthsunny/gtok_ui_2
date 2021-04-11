import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'
import { Metadata } from 'constants/index'
import { gtokFavicon } from 'images'

const StaticHeaderComponent = ({ routes }) => {
  const [metaDetails, setMetaDetails] = useState({})
  useEffect(() => {
    const path = window.location.pathname
    setMetaDetails(Metadata[path])
  }, [metaDetails])

  return (
    <div>
      <Helmet>
        <title>{metaDetails.title}</title>
        <meta name='description' content= {metaDetails.description}/>
        <meta name='keywords' content= {metaDetails.keywords} />
        <link rel='icon' type='image/png' href={gtokFavicon} sizes='16x16'/>
      </Helmet>
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
                <Link to='/posts'>Feelings</Link>
                <Link to='/activities'>Activities</Link>
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
