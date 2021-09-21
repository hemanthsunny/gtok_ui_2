import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ActivityComponent from 'components/show_activities/children/activity/component'

import {
  LoadingComponent
} from 'components'
import { getQuery, firestore } from 'firebase_config'

class ActivitiesComponent extends Component {
  constructor (props) {
    super(props)
    this.propsState = props.history.location.state || {}
    this.state = {
      activities: props.activities || [],
      userId: props.match.params.user_id || props.currentUser.id
    }
  }

  componentDidMount () {
    this.loadActivities()
  }

  loadActivities = async () => {
    this.setState({ loading: true })
    let activities = await getQuery(
      firestore.collection('activities').where('userId', '==', this.state.userId).orderBy('createdAt', 'desc').get()
    )
    activities = activities.sort((a, b) => b.createdAt - a.createdAt)
    this.setState({
      activities,
      loading: false
    })
  }

  subHeader = () => (
    <div className='dashboard-tabs' role='navigation' aria-label='Main'>
      <div className='tabs -big'>
        <div className='tab-item' onClick={e => this.props.setActiveTab('posts')}>Feelings</div>
        <div className='tab-item -active'>Activities</div>
      </div>
    </div>
  );

  render () {
    return (
      <div className='pt-2'>
        {this.subHeader()}
        <div className='activity-wrapper'>
          {
            this.state.activities.map((activity, idx) => (
              (activity.anonymous && activity.userId !== this.props.currentUser.id)
                ? <div key={idx}></div>
                : <ActivityComponent activity={activity} currentUser={this.props.currentUser} key={idx} />
            ))
          }
        </div>
        {this.state.loading && <LoadingComponent />}
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
)(withRouter(ActivitiesComponent))
