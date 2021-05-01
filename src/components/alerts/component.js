import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { motion } from 'framer-motion'
import moment from 'moment'

import HeaderComponent from './header'
import { gtokFavicon } from 'images'
import { capitalizeFirstLetter } from 'helpers'
import { SidebarComponent, LoadingComponent } from 'components'
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
      this.props.createPageVisits(this.props.currentUser)
    }, 2000)
  }

  UNSAFE_componentWillMount () {
    // window.addEventListener('scroll', this.loadMoreAlerts)
  }

  componentWillUnmount () {
    // window.removeEventListener('scroll', this.loadMoreAlerts)
  }

  updateUnreadAlerts = async () => {
    const alerts = await getQuery(
      firestore.collection('logs').where('receiverId', '==', this.props.currentUser.id).where('unread', '==', true).get()
    )
    if (alerts.length) {
      const alertIds = alerts.map(a => a.id)
      await batchUpdate('logs', alertIds, { unread: false })
    }
    this.loadAlerts()
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

  setDefaultImg = (e) => {
    e.target.src = gtokFavicon
  }

  subHeader = () => (
    <div className='dashboard-tabs' role='navigation' aria-label='Main'>
      <div className='tabs -big'>
        <Link to='/app/chats' className='tab-item'>
          Chats {this.props.newMessagesCount > 0 && <sup><img src={require('assets/svgs/DotActive.svg').default} className={'dot-icon'} alt='Dot' /></sup>}
        </Link>
        <Link to='/app/alerts' className='tab-item -active'>
          Alerts {this.props.newAlertsCount > 0 && <sup><img src={require('assets/svgs/DotActive.svg').default} className={'dot-icon'} alt='Dot' /></sup>}
        </Link>
      </div>
    </div>
  )

  render () {
    return (
      <div>
        <HeaderComponent newAlertsCount={this.props.newAlertsCount} newMessagesCount={this.props.newMessagesCount} />
        <div>
          <SidebarComponent currentUser={this.props.currentUser} />
          <div className='dashboard-content'>
            {this.subHeader()}
            <div className='container mt-4'>
            {
              this.state.loading
                ? <LoadingComponent />
                : (
                    this.state.alerts[0]
                      ? <div className='alerts-wrapper'>
                        <div className='text-violet pointer font-small mb-2' onClick={this.updateUnreadAlerts}>
                          Mark all alerts as read
                        </div>
                        <motion.div initial='initial' animate='in' exit='out' variants={pageVariants} transition={pageTransition}>
                        {
                        this.state.alerts.map((alert, idx) => (
                          <Link to={alert.actionLink || '/app/profile/' + alert.userId} key={alert.id}>
                            <div className={`card br-0 ${alert.unread && 'active-alert'}`} onClick={e => this.updateAlert(alert)}>
                              <div className='media p-3'>
                                <img className='mr-2' src={alert.photoURL || gtokFavicon} alt='Card img cap' onError={this.setDefaultImg} style={{ width: '37px', height: '37px', objectFit: 'cover', borderRadius: '50%' }} />
                                <div className='media-body font-xs-small'>
                                  {capitalizeFirstLetter(alert.text)}<br/>
                                  <small className='pull-right text-secondary'>
                                    {moment(alert.createdAt).fromNow()}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))
                      }
                        </motion.div>
                        <div className={`text-center my-3 ${(this.state.alerts.length >= (this.state.pageId * this.state.pageLimit)) && 'd-none'}`}>
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
    )
  }
}

const mapStateToProps = (state) => {
  const { alerts, newAlertsCount } = state.alerts
  const { newMessagesCount } = state.chatMessages
  return { alerts, newAlertsCount, newMessagesCount }
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
