import React from 'react'

const ActivityDescriptionComponent = ({ description, setDescription }) => {
  return (
    <div className='activity-detail-wrapper'>
      <div className='mb-2'>Description</div>
      <textarea className='form-control' value={description} onChange={e => setDescription(e.target.value)} placeholder='Write a few words on what you are doing.' rows={3}></textarea>
    </div>
  )
}

export default ActivityDescriptionComponent
