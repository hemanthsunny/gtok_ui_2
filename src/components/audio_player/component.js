import React, { useEffect, useState, useRef } from 'react'
import moment from 'moment'
import './style.css'

function AudioPlayer ({ fileUrl, postId, storyId }) {
  const [play, setPlay] = useState(true)
  const [playDetails, setPlayDetails] = useState('')
  const audioRef = useRef()

  useEffect(() => {
    // Ref: https://github.com/OlegSuncrown/react-audio-player
    // const rangeWidth = rangeRef.current.getBoundingClientRect().width
  })

  const playAudio = () => {
    let audio
    if (postId && storyId) {
      audio = document.getElementById(`audio-player-${postId}-${storyId}`)
    } else {
      audio = document.getElementById('audio-player')
    }
    const duration = parseInt(audio.duration)
    let currentTime = parseInt(audio.currentTime)

    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }

    const interval = setInterval(() => {
      currentTime = parseInt(audio.currentTime)
      setPlayDetails({
        currentTime,
        duration,
        progressPercent: parseFloat((currentTime / duration) * 100).toFixed(2)
      })
      if (currentTime >= duration) {
        clearInterval(interval)
        setPlay(prev => { return true })
      }
    }, 1000)

    setPlayDetails({
      currentTime,
      duration,
      progressPercent: parseFloat((currentTime / duration) * 100).toFixed(2)
    })
    setPlay(prevState => {
      return !prevState
    })
  }

  const onChangeAudio = (e) => {
    const audio = audioRef.current
    audio.currentTime = (audio.duration / 100) * e.target.value
    setPlayDetails({ ...playDetails, progressPercent: e.target.value })
  }

  return (
    <>
      <div className='audio-player-wrapper'>
        <audio className='d-none' id='audio-player' src={fileUrl} controls controlsList='nodownload' ref={audioRef} />
        <div className='audio-btn' onClick={playAudio}>
          <button className='btn'>
            { play
              ? <img className='btn-play' src={require('assets/svgs/Play.svg').default} alt="1" />
              : <img className='btn-pause' src={require('assets/svgs/Pause.svg').default} alt="1" />
            }
          </button>
        </div>
        <div className={`${!playDetails && 'd-none'}`}>
          <div className='audio-time'>
            <span className='current'>{moment.utc(playDetails.currentTime * 1000).format('mm:ss')}</span>
            <span className='duration'>{moment.utc(playDetails.duration * 1000).format('mm:ss')}</span>
          </div>
          <div className='progress-details'>
            <input type='range' value={playDetails.progressPercent} step='0.01' className='range' onChange={onChangeAudio} />
            <div className='progress' style={{ height: '2px' }}>
              <div className='progress-bar' role='progressbar' style={{ width: `${playDetails.progressPercent}%` }} aria-valuenow={Math.floor(playDetails.currentTime)} aria-valuemin='0' aria-valuemax='100'></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AudioPlayer
