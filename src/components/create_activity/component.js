import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { motion } from 'framer-motion'
import _ from 'lodash'

import HeaderComponent from './header'
import ActivityName from './steps/name/component'
import ActivityDescription from './steps/description/component'
import ActivitySubmit from './steps/submit/component'

import { add, timestamp, batchWrite } from 'firebase_config'
import { capitalizeFirstLetter } from 'helpers'
import { SidebarComponent } from 'components'

const pageVariants = {
  initial: {
    opacity: 0,
    x: '100vw',
    scale: 0.8
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: '-100vw',
    scale: 1.2
  }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 1
}

const ParentComponent = ({ currentUser, relations, history, prices, wallet }) => {
  const [name, setName] = useState(null)
  const [description, setDescription] = useState(null)
  const [result, setResult] = useState({})
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  useEffect(() => {
    if (touchStart && touchEnd && (touchStart - touchEnd < -75)) {
      history.push('/app/create_post')
    }
  }, [touchStart, touchEnd])

  const saveActivity = async (opts) => {
    if (opts && opts.premium && (!prices || !prices[0])) {
      alert('Before you do a premium post, set a price in your profile')
      return null
    }
    if (opts && opts.premium && (!wallet || !wallet[0])) {
      alert('Just before doing a premium post, please create a wallet')
      return null
    }
    if (!name) {
      alert('Activity is mandatory')
      return null
    }
    if (!description) {
      alert('Description is mandatory')
      return null
    }
    const data = {
      activity: capitalizeFirstLetter(name.trim()),
      description: capitalizeFirstLetter(description.trim()),
      userId: currentUser.id,
      ...opts
    }
    const result = await add('activities', data)
    /* Log the activity */
    // await add('activity', {
    //   text: `${currentUser.displayName} posted an activity`,
    //   userId: currentUser.id,
    //   collection: 'activities',
    //   timestamp
    // })
    await sendAlertsToFollowers(result.data, data)

    if (result.status === 200) {
      history.push({
        pathname: '/app/activities',
        state: { postingSuccess: true, reloadPosts: true }
      })
    } else {
      setResult(result)
    }
  }

  const sendAlertsToFollowers = async (res = {}, activity) => {
    if (res.path && !activity.anonymous) {
      /* Send alerts to all followers */
      const relationsIds = _.without(_.map(relations, rln => {
        if (rln.userIdTwo === currentUser.id && rln.status === 1) {
          return rln.userIdOne
        }
      }), undefined)
      await batchWrite('logs', relationsIds, {
        text: `@${currentUser.username} recently posted an activity. Appreciate it now.`,
        photoURL: currentUser.photoURL,
        userId: currentUser.id,
        actionLink: `/app/${res.path}`,
        unread: true,
        timestamp
      })
    }
  }

  const onTouchStart = (e) => {
    setTouchStart(e.changedTouches[0].clientX)
    setTouchEnd(0)
  }

  const onTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX)
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
      <HeaderComponent />
      <div>
        <SidebarComponent currentUser={currentUser} />
        <div className='dashboard-content' onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
           {subHeader()}
           <motion.div initial='initial' animate='in' exit='out' variants={pageVariants} transition={pageTransition}>
             <div className='container create-activity-wrapper pb-150'>
               <div className='text-center'>
                 {
                   result.status &&
                   <div className={`text-${result.status === 200 ? 'success' : 'danger'} mb-2`}>
                     {result.message}
                   </div>
                 }
               </div>
               <ActivityName name={name} setName={setName} />
               { name && <ActivityDescription setDescription={setDescription} /> }
               { name && <ActivitySubmit save={saveActivity} /> }

               {/*
               { stepNumber === 1 && <ActivityName name={name} setName={setName} setStepNumber={setStepNumber} /> }
               { stepNumber === 2 && <ActivityDetail name={name} setDetail={setDetail} setStepNumber={setStepNumber} /> }
               { stepNumber === 3 && <ActivityDescription setDescription={setDescription} setStepNumber={setStepNumber} /> }
               { stepNumber === 4 && <ActivitySubmit save={saveActivity} setStepNumber={setStepNumber} /> }
               { stepNumber === 5 && <ActivityStartTime setStartTime={setStartTime} setStepNumber={setStepNumber} /> }
               { stepNumber === 6 && <ActivityEndTime startTime={startTime} endTime={endTime} setEndTime={setEndTime} setStepNumber={setStepNumber} /> }
               */}
             </div>
           </motion.div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { relations } = state.relationships
  const { wallet } = state.wallet
  const { prices } = state.prices
  return { relations, wallet, prices }
}

export default connect(
  mapStateToProps,
  null
)(withRouter(ParentComponent))
