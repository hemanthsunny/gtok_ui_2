import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { motion } from 'framer-motion'

import HeaderComponent from './header'
import ActivityComponent from './children/activity/component'

import {
  SidebarComponent,
  LoadingComponent
} from 'components'
import { getQuery, firestore } from 'firebase_config'
import { pageVariants, pageTransition } from 'constants/framer-motion'

class ParentComponent extends Component {
  constructor (props) {
    super(props)
    this.propsState = props.history.location.state || {}
    this.state = {
      activities: props.activities || []
    }
  }

  componentDidMount () {
    this.loadActivities()
  }

  loadActivities = async () => {
    this.setState({ loading: true })
    let activities = await getQuery(
      firestore.collection('activities').orderBy('createdAt', 'desc').get()
    )
    activities = activities.sort((a, b) => b.createdAt - a.createdAt)
    this.setState({
      pageId: 2,
      activities,
      loading: false
    })
    // await this.bindPosts(this.props.currentUser, 'none', posts);
  }

  touchStart = (e) => {
    this.setState({
      touchStart: e.changedTouches[0].clientX
    })
  }

  touchEnd = (e) => {
    this.setState({
      touchEnd: e.changedTouches[0].clientX
    }, () => {
      this.handleGesture()
    })
  }

  handleGesture = (e) => {
    if (this.state.touchStart - this.state.touchEnd < -150) {
      this.props.history.push('/app/posts')
    }
  }

  subHeader = () => (
    <div className='dashboard-tabs' role='navigation' aria-label='Main'>
      <div className='tabs -big'>
        <Link to='/app/posts' className='tab-item'>Feelings</Link>
        <Link to='/app/activities' className='tab-item -active'>Activities</Link>
      </div>
    </div>
  );

  render () {
    return (
      <div style={{ background: 'rgba(0, 0, 0, 0.01)' }}>
        <HeaderComponent newAlertsCount={this.props.newAlertsCount} newMessagesCount={this.props.newMessagesCount} />
        <div>
          <SidebarComponent currentUser={this.props.currentUser} />
          <div className='dashboard-content' onTouchStart={this.touchStart} onTouchEnd={this.touchEnd}>
            {this.subHeader()}
            <motion.div initial='initial' animate='in' exit='out' variants={pageVariants} transition={pageTransition}>
              <div className='activity-wrapper'>
                {this.state.activities.map((activity, idx) => (
                  <ActivityComponent activity={activity} currentUser={this.props.currentUser} key={idx} />
                ))}
              </div>
              {this.state.loading && <LoadingComponent />}
            </motion.div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { newAlertsCount } = state.alerts
  const { newMessagesCount } = state.chatMessages
  return { newAlertsCount, newMessagesCount }
}

export default connect(
  mapStateToProps,
  null
)(withRouter(ParentComponent))
