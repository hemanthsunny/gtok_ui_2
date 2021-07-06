import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { motion } from 'framer-motion'
import moment from 'moment'
import './style.css'

import HeaderComponent from './header'
import { capitalizeFirstLetter } from 'helpers'
import { LoadingComponent, CustomImageComponent, MobileFooterComponent } from 'components'
import { SetAlerts, CreatePageVisits, SetNewAlertsCount } from 'store/actions'
import { getQuery, firestore, batchUpdate, update } from 'firebase_config'
import { pageVariants, pageTransition } from 'constants/framer-motion'

class ParentComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      alerts: props.alerts,
      pageId: 1,
      pageLimit: 25
    }
  }

  componentDidMount () {
    if (!this.state.alerts[0]) {
      this.loadAlerts()
    }
    setTimeout(() => {
      this.updateUnreadAlerts(false)
      this.props.createPageVisits(this.props.currentUser)
    }, 2000)
  }

  UNSAFE_componentWillMount () {
    // window.addEventListener('scroll', this.loadMoreAlerts)
  }

  componentWillUnmount () {
    // window.removeEventListener('scroll', this.loadMoreAlerts)
  }

  updateUnreadAlerts = async (reload = true) => {
    const alerts = await getQuery(
      firestore.collection('logs').where('receiverId', '==', this.props.currentUser.id).where('unread', '==', true).get()
    )
    if (alerts.length) {
      const alertIds = alerts.map(a => a.id)
      await batchUpdate('logs', alertIds, { unread: false })
    }
    if (reload) {
      this.loadAlerts()
    }
    this.props.bindNewAlertsCount(this.props.currentUser)
  }

  updateAlert = async (alert) => {
    if (alert.unread) {
      await update('logs', alert.id, { unread: false })
    }
    this.props.bindNewAlertsCount(this.props.currentUser)
  }

  loadAlerts = async () => {
    this.setState({ loading: true })
    let alerts = await getQuery(
      firestore.collection('logs').where('receiverId', '==', this.props.currentUser.id).orderBy('createdAt', 'desc').limit(this.state.pageLimit).get()
    )
    alerts = alerts.sort((a, b) => b.createdAt - a.createdAt)
    this.setState({
      pageId: 2,
      alerts,
      loading: false
    })
    await this.props.bindAlerts(this.props.currentUser, 'none', alerts)
  }

  loadMoreAlerts = async () => {
    this.setState({ loading: true })
    let alerts = await getQuery(
      firestore.collection('logs').where('receiverId', '==', this.props.currentUser.id).orderBy('createdAt', 'desc').limit(this.state.pageId * this.state.pageLimit).get()
    )
    alerts = alerts.sort((a, b) => b.createdAt - a.createdAt)
    this.setState({
      pageId: this.state.pageId + 1,
      alerts,
      loading: false
    })
    await this.props.bindAlerts(this.props.currentUser, 'none', alerts)

    // if (
    //   window.innerHeight + document.documentElement.scrollTop >= document.scrollingElement.scrollHeight &&
    //   this.state.alerts.length < (this.state.pageId * this.state.pageLimit)
    // ) {
    // }
  }

  subHeader = () => (
    <div className='dashboard-tabs d-none' role='navigation' aria-label='Main'>
      <div className='tabs -big'>
        <Link to='/app/alerts' className='tab-item -active'>
          Alerts {this.props.newAlertsCount > 0 && <sup><img src={require('assets/svgs/DotActive.svg').default} className={'dot-icon'} alt='Dot' /></sup>}
        </Link>
        <Link to='/app/chats' className='tab-item'>
          Trading {this.props.newMessagesCount > 0 && <sup><img src={require('assets/svgs/DotActive.svg').default} className={'dot-icon'} alt='Dot' /></sup>}
        </Link>
      </div>
    </div>
  )

  render () {
    return (
      <div>
        <HeaderComponent />
        <div>
          <div className='dashboard-content'>
            {this.subHeader()}
            <div className='container px-4'>
              <div className='alerts-wrapper'>
              {
                this.props.pendingRelationsCount > 0 &&
                  <div className='media pending-request'>
                    <CustomImageComponent user={this.props.currentUser} />
                    <sup className='badge badge-danger pending-count'>{this.props.pendingRelationsCount}</sup>
                    <Link to='/app/requests' className='media-body align-self-center font-small'>
                      Pending requests
                    </Link>
                  </div>
              }
              {
                this.state.loading
                  ? <LoadingComponent />
                  : (
                      this.state.alerts[0]
                        ? <div className='mt-2'>
                          <div className='mark-alerts' onClick={this.updateUnreadAlerts}>
                            Mark all alerts as read
                          </div>
                          <motion.div initial='initial' animate='in' exit='out' variants={pageVariants} transition={pageTransition}>
                          {
                          this.state.alerts.map((alert, idx) => (
                            <Link to={alert.actionLink || '/app/profile/' + alert.userId} key={alert.id}>
                              <div className='card br-0' onClick={e => this.updateAlert(alert)}>
                                <div className='media py-2'>
                                  <CustomImageComponent user={alert} />
                                  <sup className={`alert-dot ${!alert.unread && 'd-none'}`}><img src={require('assets/svgs/DotActive.svg').default} className='dot-chat-icon' alt='Dot' /></sup>
                                  <div className='media-body pl-2 font-xs-small'>
                                    <span className={`${alert.unread && 'fw-900'}`}>{capitalizeFirstLetter(alert.text)}</span>
                                    <div className='created-at'>
                                      {moment(alert.createdAt).fromNow()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))
                        }
                          </motion.div>
                          <div className={`text-center my-3 ${(this.state.alerts.length < (this.state.pageId * this.state.pageLimit)) && 'd-none'}`}>
                            <button className='btn btn-violet btn-sm' onClick={this.loadMoreAlerts}>Load more</button>
                          </div>
                        </div>
                        : <div className='text-center mt-5'>
                          You haven't received any alerts yet.
                        </div>
                    )
              }
              </div>
            </div>
          </div>
        </div>
        <MobileFooterComponent currentUser={this.props.currentUser} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { alerts, newAlertsCount } = state.alerts
  const { pendingRelationsCount } = state.relationships
  return { alerts, newAlertsCount, pendingRelationsCount }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindNewAlertsCount: (content) => dispatch(SetNewAlertsCount(content)),
    bindAlerts: (content, type, data) => dispatch(SetAlerts(content, type, data)),
    createPageVisits: (content, type) => dispatch(CreatePageVisits(content))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParentComponent)
