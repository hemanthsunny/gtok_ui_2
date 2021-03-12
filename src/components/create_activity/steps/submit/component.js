import React, { useState } from 'react'

const ActivitySubmitComponent = ({ save, setStepNumber }) => {
  const [premium, setPremium] = useState(false)

  const saveDescription = async () => {
    await save({ premium })
  }

  const goBack = () => {
    setStepNumber(3)
  }

  return (
    <div className='container activity-submit-wrapper pt-5'>
      <div>
        Make it as premium
        <img src={premium ? require('assets/svgs/CheckboxActive.svg').default : require('assets/svgs/Checkbox.svg').default} className='checkbox-icon pull-right' alt='Premium' onClick={e => setPremium(!premium)} />
      </div>
      <button className='btn btn-submit my-3' onClick={goBack}>
        Back
      </button>
      <button className='btn btn-submit my-3 pull-right' onClick={saveDescription}>
        Save
      </button>
    </div>
  )
}

export default ActivitySubmitComponent
