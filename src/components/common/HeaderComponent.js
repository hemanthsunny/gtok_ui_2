import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { Metadata } from 'constants/index'
import { SetNewMessagesCount, SetNewAlertsCount, SetSurveysList, SetRelationships, SetPurchaseOrders, SetPrices, SetWallet } from 'store/actions'
import { HelmetMetaDataComponent } from 'components'

const HeaderComponent = ({
  currentUser,
  newMessagesCount,
  bindNewMessagesCount,
  newAlertsCount,
  bindNewAlertsCount,
  bindSurveysList,
  bindRelationships,
  bindPurchaseOrders,
  bindWallet,
  bindPrices,
  pendingRelationsCount
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
    } else {
      setMetaDetails(Metadata[path || 'default'])
    }
    bindNewMessagesCount(currentUser)
    bindNewAlertsCount(currentUser)
    // bindSurveysList(currentUser);
    bindRelationships(currentUser)
    bindPurchaseOrders(currentUser)
    bindWallet(currentUser)
    bindPrices(currentUser)
  }, [metaDetails, bindNewMessagesCount, bindNewAlertsCount, bindSurveysList, currentUser, bindRelationships, bindPurchaseOrders, bindPrices, bindWallet])

  return (
    <div>
      {
        metaDetails && metaDetails.title &&
        <HelmetMetaDataComponent title={metaDetails.title} keywords={metaDetails.keywords} description={metaDetails.description}/>
      }
      <nav className='navbar fixed-top header'>
        <div className='container-fluid'>
          <div className='navbar-brand mr-auto'>
            <Link to='/app/posts'>
              <span className='home-page-title'>Lets Gtok</span>
            </Link>
          </div>
          <ul className='navbar-nav ml-auto'>
            <li className='nav-item'>
              <div className='nav-link p-0'>
                <Link to='/app/search' title='Search'>
                  Search
                  {(pendingRelationsCount > 0) && <sup><img src={require('assets/svgs/DotActive.svg').default} className={'dot-icon'} alt='Dot' /></sup>}
                </Link>
                <Link to='/app/chats' title='Notifications'>
                  Notifications
                  {(newMessagesCount > 0 || newAlertsCount > 0) && <sup><img src={require('assets/svgs/DotActive.svg').default} className={'dot-icon'} alt='Dot' /></sup>}
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { newMessagesCount } = state.chatMessages
  const { newAlertsCount } = state.alerts
  const { pendingRelationsCount } = state.relationships
  return { newAlertsCount, newMessagesCount, pendingRelationsCount }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindNewMessagesCount: (content) => dispatch(SetNewMessagesCount(content)),
    bindNewAlertsCount: (content) => dispatch(SetNewAlertsCount(content)),
    bindSurveysList: (content) => dispatch(SetSurveysList(content)),
    bindRelationships: (content) => dispatch(SetRelationships(content)),
    bindPurchaseOrders: (content) => dispatch(SetPurchaseOrders(content)),
    bindWallet: (content) => dispatch(SetWallet(content)),
    bindPrices: (content) => dispatch(SetPrices(content))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderComponent)
