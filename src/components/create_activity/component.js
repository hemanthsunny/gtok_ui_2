import React, { useState } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'

import HeaderComponent from './header'
import ActivityName from './steps/name/component'
import ActivityDetail from './steps/detail/component'
import ActivityDescription from './steps/description/component'
import ActivityStartTime from './steps/start_time/component'
import ActivityEndTime from './steps/end_time/component'
import ActivitySubmit from './steps/submit/component'

import { add } from 'firebase_config'
import { capitalizeFirstLetter } from 'helpers'
import { SetNewPost } from 'store/actions'
import { SidebarComponent } from 'components'

const ParentComponent = ({ currentUser, bindNewPost, newAlertsCount, newMessagesCount, history, prices, wallet }) => {
  const [name, setName] = useState(null)
  const [detail, setDetail] = useState(null)
  const [description, setDescription] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [stepNumber, setStepNumber] = useState(1)
  const [result, setResult] = useState({})

  const saveActivity = async (opts) => {
    if (opts && opts.premium && (!prices || !prices[0])) {
      alert('Before you do a premium post, set a price in your profile')
      return null
    }
    if (opts && opts.premium && (!wallet || !wallet[0])) {
      alert('Just before doing a premium post, please create a wallet')
      return null
    }
    const data = {
      activity: name.trim(),
      detail: detail.trim(),
      text: `${capitalizeFirstLetter(currentUser.displayName)} ${capitalizeFirstLetter(name.trim())} ${capitalizeFirstLetter(detail.trim())}`,
      description: (description && description.trim()) || '',
      userId: currentUser.id,
      ...opts
    }
    const result = await add('activities', data)

    /* Log the activity */
    // await add('logs', {
    //   text: `${currentUser.displayName} posted an activity`,
    //   userId: currentUser.id,
    //   collection: 'activities',
    //   timestamp
    // });
    if (result.status === 200) {
      history.push({
        pathname: '/app/activities',
        state: { postingSuccess: true, reloadPosts: true }
      })
    } else {
      setResult(result)
    }
  }

  const subHeader = () => (
    <div className='dashboard-tabs' role='navigation' aria-label='Main'>
      <div className='tabs -big'>
        <Link to='/app/create_post' className='tab-item'>Share Feeling</Link>
        <Link to='/app/create_activity' className='tab-item -active'>Share Activity</Link>
      </div>
    </div>
  )

  return (
    <div>
      <HeaderComponent newAlertsCount={newAlertsCount} newMessagesCount={newMessagesCount} />
      <div>
        <SidebarComponent currentUser={currentUser} />
        <div className='dashboard-content'>
           {subHeader()}
           <div className='container create-activity-wrapper'>
             <div className='text-center'>
               {
                 result.status &&
                 <div className={`text-${result.status === 200 ? 'success' : 'danger'} mb-2`}>
                   {result.message}
                 </div>
               }
             </div>
             { stepNumber === 1 && <ActivityName name={name} setName={setName} setStepNumber={setStepNumber} /> }
             { stepNumber === 2 && <ActivityDetail name={name} setDetail={setDetail} setStepNumber={setStepNumber} /> }
             { stepNumber === 3 && <ActivityDescription setDescription={setDescription} setStepNumber={setStepNumber} /> }
             { stepNumber === 4 && <ActivitySubmit save={saveActivity} setStepNumber={setStepNumber} /> }
             { stepNumber === 5 && <ActivityStartTime setStartTime={setStartTime} setStepNumber={setStepNumber} /> }
             { stepNumber === 6 && <ActivityEndTime startTime={startTime} endTime={endTime} setEndTime={setEndTime} setStepNumber={setStepNumber} /> }
           </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { newAlertsCount } = state.alerts
  const { newMessagesCount } = state.chatMessages
  const { wallet } = state.wallet
  const { prices } = state.prices
  return { newAlertsCount, newMessagesCount, wallet, prices }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindNewPost: (content) => dispatch(SetNewPost(content))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ParentComponent))
