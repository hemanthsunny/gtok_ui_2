import React, { useState } from 'react'

const DetailComponent = ({ setStepNumber, postText, setPostText, btnUpload, fileUrl, uploadAudio, deleteFile }) => {
  const [play, setPlay] = useState(true)
  const [playDetails, setPlayDetails] = useState('')

  const handleChange = async (val) => {
    setPostText(val)
  }

  const playAudio = () => {
    const audio = document.getElementById('audio-player')
    const duration = parseInt(audio.duration)
    let currentTime = parseInt(audio.currentTime)

    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }

    const interval = setInterval(() => {
      currentTime = parseInt(audio.currentTime)
      setPlayDetails({ currentTime, duration })
      if (currentTime >= duration) {
        clearInterval(interval)
        setPlay(prev => { return true })
      }
    }, 1000)

    setPlayDetails({ currentTime, duration })
    setPlay(prevState => {
      return !prevState
    })
  }

  return (
    <div className='feeling-detail-wrapper'>
      <div className='description'>
        <textarea className='form-control' value={postText} onChange={e => handleChange(e.target.value)} placeholder='How are you feeling today?' rows={5}></textarea>
      </div>
      <div className='attachment'>
        <label htmlFor='staticAudioFile'>
        {
          btnUpload === 'upload'
            ? !fileUrl &&
            <div>
              <img src={require('assets/svgs/AttachmentActive.svg').default} className='attachment-icon' alt='Audio' />
              <small className='pl-2'>Only audios accepted at the moment</small>
            </div>
            : <button className='btn audio-btn'><i className='fa fa-spinner fa-spin'></i></button>
        }
        </label>
        <input type='file' className='form-control-plaintext d-none' id='staticAudioFile' onChange={e => uploadAudio(e.target.files[0])} accept='audio/*' />
        {
          fileUrl &&
          <div className='d-flex align-items-center'>
            <audio className='d-none' id='audio-player' src={fileUrl} />
            <button className='btn audio-btn' onClick={playAudio}><i className={`fa fa-${play ? 'play' : 'pause'}`}></i></button>{playDetails && <small className='audio-details'>{playDetails.currentTime} / {playDetails.duration}</small>}
            <img src={require('assets/svgs/Trash.svg').default} className='trash-icon pull-right' alt='Remove' onClick={deleteFile} />
          </div>
        }
      </div>
    </div>
  )
}

export default DetailComponent
