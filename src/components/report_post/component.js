import React, { useState } from 'react'
import $ from 'jquery'

import {
  add,
  getQuery,
  firestore,
  timestamp
} from 'firebase_config'

const ParentComponent = ({
  currentUser, postId, collection
}) => {
  const [comment, setComment] = useState('')
  const [other, setOther] = useState(false)

  const reportPost = async (e) => {
    if (!comment) {
      alert('Please choose a suitable option.')
      return null
    }
    const report = await getQuery(
      firestore.collection('report_posts').where('postId', '==', postId).where('userId', '==', currentUser.id).get()
    )
    if (!report[0]) {
      await add('report_posts', {
        userId: currentUser.id,
        postId,
        comment,
        collection
      })
      /* Log the activity */
      await add('logs', {
        text: `${currentUser.displayName} reported a post`,
        userId: currentUser.id,
        actionType: 'add',
        collection: 'report_posts',
        actionLink: '/app/report_posts/' + postId,
        timestamp
      })
      alert('Thanks for informing us. Your report has been received.')
    } else {
      alert('This post has already been reported by you.')
    }
    $('[data-dismiss=modal]').trigger({ type: 'click' })
  }

  const handleChange = (e) => {
    if (e.target.value === 'Other') {
      setOther(true)
      setComment('')
    } else {
      setOther(false)
      setComment(e.target.value)
    }
  }

  return (
    <div className='modal' tabIndex='-1' role='dialog' id='reportPostModal' aria-labelledby='reportPostModalLabel'>
      <div className='modal-dialog' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Report post</h5>
            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div className='modal-body'>
            <p>Why are you reporting this post?</p>
            <div>
              <div className=''>
                <input type='radio' id='report1' name='report' value='Spam / Promotional' onChange={e => handleChange(e)} />
                <label className='custom-control-label' htmlFor='report1'>Spam / Promotional</label>
              </div>
              <div className='my-2'>
                <input type='radio' id='report2' name='report' value='Hate Speech' onChange={e => handleChange(e)} />
                <label className='custom-control-label' htmlFor='report2'>Hate Speech</label>
              </div>
              <div className='my-2'>
                <input type='radio' id='report3' name='report' value='Violence' onChange={e => handleChange(e)} />
                <label className='custom-control-label' htmlFor='report3'>Violence</label>
              </div>
              <div className='my-2'>
                <input type='radio' id='report4' name='report' value='Inappropriate' onChange={e => handleChange(e)} />
                <label className='custom-control-label' htmlFor='report4'>Inappropriate</label>
              </div>
              <div className='my-2'>
                <input type='radio' id='report5' name='report' value='Other' onChange={e => handleChange(e)} />
                <label className='custom-control-label' htmlFor='report5'>Other</label>
              </div>
              {other && <textarea className='form-control my-2' value={comment} onChange={e => setComment(e.target.value)} placeholder="Comment" autoFocus='true'></textarea>}
            </div>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-outline-secondary' data-dismiss='modal'>Close</button>
            <button type='button' className='btn btn-violet' onClick={reportPost}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParentComponent
