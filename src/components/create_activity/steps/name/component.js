import React, { useState } from 'react'

const ActivityNameComponent = ({ name, setName, setStepNumber }) => {
  const [localVar, setLocalVar] = useState(null)
  const [other, setOther] = useState(false)
  const [alert, setAlert] = useState(null)
  const values = ['Cooking', 'Playing', 'Reading', 'Sleeping', 'Watching', 'Other']

  const handleChange = (val) => {
    const wordcount = val.split(' ')
    if (val && wordcount.length > 1) {
      setAlert('Only 1 word accepted')
      return null
    } else { setAlert(null) }

    if (val === 'Other') {
      setOther(true)
      setLocalVar(null)
    } else {
      setLocalVar(val)
    }
  }

  const saveName = () => {
    const val = localVar.split(' ')
    setName(val[0].toLowerCase())
    setStepNumber(2)
  }

  return (
    <div className='container activity-name-wrapper'>
      <div className='header'>What are you doing right now?</div>
      <div className='options row'>
        {values.map((val, idx) => (
          <div key={idx} className='col-4'>
            <input type='radio' name='activity_name' id={`rd${idx}`} onChange={e => handleChange(val)} />
            <label htmlFor={`rd${idx}`}>{val}</label>
          </div>
        ))}
        {
          other &&
          <input type='text' name='activity_name' className='form-control' onChange={e => handleChange(e.target.value)} placeholder='Only 1 word accepted' />
        }
      </div>
      <small className='text-danger'>{alert}</small>
      <button className={`btn btn-submit pull-right ${(!localVar || alert) && 'd-none'}`} onClick={saveName}>
        Next
      </button>
    </div>
  )
}

export default ActivityNameComponent
