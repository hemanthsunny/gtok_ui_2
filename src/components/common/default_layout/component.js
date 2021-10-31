import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { motion } from 'framer-motion'

import { HeaderComponent, UserPermissionsComponent } from 'components'
import { SetNewMessagesCount, SetNewAlertsCount, SetSurveysList, SetRelationships, SetPurchaseOrders, SetPrices, SetWallet, SetTransactions } from 'store/actions'

const pageTransition = {
  in: {
    opacity: 1
  },
  out: {
    opacity: 0.95
  }
}

const DefaultLayout = ({
  children,
  dbUser,
  bindNewMessagesCount,
  bindNewAlertsCount,
  bindSurveysList,
  bindRelationships,
  bindPurchaseOrders,
  bindWallet,
  bindPrices,
  bindTransactions
}) => {
  useEffect(() => {
    bindNewMessagesCount(dbUser)
    bindNewAlertsCount(dbUser)
    bindRelationships(dbUser)
    bindPurchaseOrders(dbUser)
    bindWallet(dbUser)
    bindPrices(dbUser)
    bindTransactions(dbUser)
  }, [bindNewMessagesCount, bindNewAlertsCount, dbUser, bindRelationships, bindPurchaseOrders, bindPrices, bindWallet, bindTransactions])

  return (
    <div>
      {(window.innerWidth > 576) && <HeaderComponent currentUser={dbUser} />}
      <UserPermissionsComponent />
      <div className='mt-4 mb-5 bottom-sm-padding'>
        <motion.div initial='out' animate='in' exit='out' variants={pageTransition}>
          {children}
        </motion.div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { dbUser } = state.authUsers
  const { newMessagesCount } = state.chatMessages
  const { newAlertsCount } = state.alerts
  return { newMessagesCount, newAlertsCount, dbUser }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindNewMessagesCount: (content) => dispatch(SetNewMessagesCount(content)),
    bindNewAlertsCount: (content) => dispatch(SetNewAlertsCount(content)),
    bindSurveysList: (content) => dispatch(SetSurveysList(content)),
    bindRelationships: (content) => dispatch(SetRelationships(content)),
    bindPurchaseOrders: (content) => dispatch(SetPurchaseOrders(content)),
    bindWallet: (content) => dispatch(SetWallet(content)),
    bindPrices: (content) => dispatch(SetPrices(content)),
    bindTransactions: (content) => dispatch(SetTransactions(content))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultLayout)
