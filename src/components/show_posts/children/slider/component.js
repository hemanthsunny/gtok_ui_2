import React, { useEffect } from 'react'
import './style.css'

function Slider ({ playDetails, onChange }) {
  useEffect(() => {
    // Ref: https://github.com/OlegSuncrown/react-audio-player
    // const rangeWidth = rangeRef.current.getBoundingClientRect().width
  })

  return (
    <div className='progress-details'>
      <input type='range' value={playDetails.progressPercent || 0} step='0.01' className='range' onChange={onChange} />
      <div className='progress'>
        <div className='progress-bar' role='progressbar' style={{ width: `${playDetails.progressPercent}%` }} aria-valuenow={Math.floor(playDetails.currentTime)} aria-valuemin='0' aria-valuemax='100'></div>
      </div>
      <div className='progress-cirlce d-none' style={{ left: `${playDetails.progressPercent - 2}%` }}></div>
    </div>
  )
}

export default Slider
