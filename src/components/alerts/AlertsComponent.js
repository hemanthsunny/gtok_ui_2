import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'

import { gtokFavicon } from 'images'
import { capitalizeFirstLetter } from 'helpers'
import { LoadingComponent, AlertHeaderComponent } from 'components'
import { SetAlerts, CreatePageVisits } from 'store/actions'

const AlertsComponent = ({
  currentUser, alerts, bindAlerts, createPageVisits, newAlertsCount
}) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!alerts[0] || newAlertsCount > 0) bindAlerts(currentUser, 'all')
    setLoading(false)
    setTimeout(() => {
      createPageVisits(currentUser)
    }, 2000)
  }, [bindAlerts, currentUser, alerts, createPageVisits, newAlertsCount])

  const setDefaultImg = (e) => {
    e.target.src = gtokFavicon
  }

  return (
    <div>
      <AlertHeaderComponent />
      <div className='container'>
        <div className='card alerts-wrapper'>
          <div className='card-header py-1 px-2'>
            <small>Recent Alerts</small>
          </div>
          {
            loading
              ? <LoadingComponent />
              : (
                  alerts[0]
                    ? alerts.map(alert => (
                <Link to={alert.actionLink || '/app/profile/' + alert.userId} key={alert.id}>
                  <div className='media p-3' style={{ boxShadow: '1px 1px 2px gainsboro' }}>
                    <img className='mr-2' src={alert.photoURL || gtokFavicon} alt='Card img cap' onError={setDefaultImg} style={{ width: '37px', height: '37px', objectFit: 'cover', borderRadius: '50%' }} />
                    <div className='media-body font-xs-small'>
                      {capitalizeFirstLetter(alert.text)}<br/>
                      <small className='pull-right text-secondary'>
                        {moment(alert.createdAt).fromNow()}
                      </small>
                    </div>
                  <hr/>
                </div>
                </Link>
                    ))
                    : <div className='text-secondary text-center p-2'>No alerts to show</div>
                )
          }
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { alerts, newAlertsCount } = state.alerts
  return { alerts, newAlertsCount }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindAlerts: (content, type) => dispatch(SetAlerts(content, type)),
    createPageVisits: (content, type) => dispatch(CreatePageVisits(content))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertsComponent)
