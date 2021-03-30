import React, { useState } from 'react'

const ActivityNameComponent = ({ name, setName }) => {
  const [other, setOther] = useState(false)
  const values = ['Cooking', 'Playing', 'Reading', 'Sleeping', 'Watching', 'Other']

  const handleChange = async (val) => {
    if (val === 'Other') {
      setOther(true)
      setName(null)
    } else {
      setOther(false)
      setName(val)
    }
  }

  return (
    <div className='container activity-name-wrapper'>
      <div className='header'>What are you doing right now?</div>
      <div className='options row'>
        {values.map((val, idx) => (
          <div key={idx} className='col-12'>
            <input type='radio' name='activity_name' id={`rd${idx}`} onChange={e => handleChange(val)} />
            <label htmlFor={`rd${idx}`}>{val}</label>
          </div>
        ))}
        {
          other &&
          <input type='text' name='activity_name' className='form-control mx-3' onChange={e => setName(e.target.value)} placeholder='Your activity here...' />
        }
      </div>
      <small className='text-danger'>{alert}</small>
    </div>
  )
}

export default ActivityNameComponent
