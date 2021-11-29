import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import './style.css'

import { SetCurrentAudio } from 'store/actions'

function AudioPlayer ({ fileUrl, postId, storyId, currentAudio, bindCurrentAudio }) {
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
    } else if (postId) {
      audio = document.getElementById(`audio-player-${postId}`)
    } else {
      audio = document.getElementById('audio-player')
    }
    if (audio !== currentAudio) {
      bindCurrentAudio(audio)
      currentAudio && currentAudio.pause()
    }
    const duration = parseInt(audio.duration)
    let currentTime = parseInt(audio.currentTime)

    if (audio.paused) {
      audio.play()
      setPlay(prevState => {
        return false
      })
    } else {
      audio.pause()
      setPlay(prevState => {
        return true
      })
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
  }

  const onChangeAudio = (e) => {
    const audio = audioRef.current
    audio.currentTime = (audio.duration / 100) * e.target.value
    setPlayDetails({ ...playDetails, progressPercent: e.target.value })
  }

  return (
    <>
      <div className='audio-player-wrapper'>
        <audio className='d-none' id={`audio-player-${postId}-${storyId}`} src={fileUrl} controls controlsList='nodownload' ref={audioRef} />
        <div className='audio-btn' onClick={playAudio}>
          <button className='btn'>
            <img className={`btn-${play ? 'play' : 'pause'}`} src={require(`assets/svgs/${play ? 'Play' : 'Pause'}.svg`).default} alt="1" />
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

const mapStateToProps = (state) => {
  const { currentAudio } = state.audioPlayer
  return { currentAudio }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindCurrentAudio: (audio) => dispatch(SetCurrentAudio(audio))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioPlayer)
