import React from 'react'

const SubmitComponent = ({ save, setStepNumber, anonymous, setAnonymous }) => {
  // const [premium, setPremium] = useState(false)
  // const [anonymous, setAnonymous] = useState(false)

  const submit = async () => {
    await save({ anonymous })
  }

  return (
    <div className='feeling-submit-wrapper'>
      <div className='p-1 pointer' onClick={e => setAnonymous(!anonymous)}>
        <img src={anonymous ? require('assets/svgs/CheckboxActive.svg').default : require('assets/svgs/Checkbox.svg').default} className='checkbox-icon' alt='anonymous' />
        <span className='pl-2'>Post anonymously</span>
      </div>
      <div className='p-1 display-right'>
        <button className='btn btn-violet btn-sm' onClick={submit}>
          Save
        </button>
      </div>
    </div>
  )
}

export default SubmitComponent
