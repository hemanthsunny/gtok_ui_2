import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import HeaderComponent from './header'

import { gtokFavicon } from 'images'
import { capitalizeFirstLetter } from 'helpers'
import { SidebarComponent, LoadingComponent } from 'components'
import { SetAlerts, CreatePageVisits } from 'store/actions'
import { getQuery, firestore } from 'firebase_config'

class ParentComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      alerts: props.alerts,
      pageId: 1,
      pageLimit: 15
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
    window.addEventListener('scroll', this.loadMoreAlerts)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.loadMoreAlerts)
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
  }

  loadMoreAlerts = async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.scrollingElement.scrollHeight
    ) {
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
    }
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
                      ? <div className='card alerts-wrapper'> {
                        this.state.alerts.map(alert => (
                          <Link to={alert.actionLink || '/app/profile/' + alert.userId} key={alert.id}>
                            <div className='media p-3' style={{ boxShadow: '1px 1px 2px gainsboro' }}>
                              <img className='mr-2' src={alert.photoURL || gtokFavicon} alt='Card img cap' onError={this.setDefaultImg} style={{ width: '37px', height: '37px', objectFit: 'cover', borderRadius: '50%' }} />
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
                      }
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
    bindAlerts: (content, type) => dispatch(SetAlerts(content, type)),
    createPageVisits: (content, type) => dispatch(CreatePageVisits(content))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParentComponent)
