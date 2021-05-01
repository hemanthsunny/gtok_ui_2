import React from 'react'
import { connect } from 'react-redux'
import { motion } from 'framer-motion'

import { HeaderComponent, BottomHeaderComponent, UserPermissionsComponent } from 'components'

const pageTransition = {
  in: {
    opacity: 1
  },
  out: {
    opacity: 0.95
  }
}

const DefaultLayout = ({ children, dbUser }) => {
  return (
    <div>
      {(window.innerWidth < 576) ? <BottomHeaderComponent currentUser={dbUser} /> : <HeaderComponent currentUser={dbUser} />}
      <UserPermissionsComponent />
      <div className='mt-5 mb-5 pt-3 bottom-sm-padding'>
        <motion.div initial='out' animate='in' exit='out' variants={pageTransition}>
          {children}
        </motion.div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { dbUser } = state.authUsers
  return { dbUser }
}

export default connect(
  mapStateToProps,
  null
)(DefaultLayout)
