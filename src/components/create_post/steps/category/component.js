import React, { useState } from 'react'
// import $ from 'jquery'

const DetailComponent = ({ currentUser, setStepNumber, handleChange, category, setCategory, postCategories }) => {
  const [other, setOther] = useState(category.key === 'other')
  const [otherValue, setOtherValue] = useState(category.key === 'other' && category.title)
  const [errorMsg, setErrorMsg] = useState('')
  const categoryPattern = /^[a-zA-Z\s]+$/i

  const handleCategory = async (cat) => {
    if (cat && categoryPattern.test(cat.title)) {
      setErrorMsg('')
      setOtherValue('')
      setCategory(cat)
      if (cat.key === 'other') {
        setOther(true)
      } else {
        setOther(false)
        window.$('#selectPostCategoryModal').modal('hide')
      }
    } else {
      setErrorMsg('Only alphabets supported')
    }
  }

  const submitCategory = () => {
    if (category.key === 'other' && categoryPattern.test(otherValue)) {
      setErrorMsg('')
      setCategory({
        title: otherValue.trim() ? otherValue.toLowerCase() : 'other',
        key: 'other'
      })
      window.$('#selectPostCategoryModal').modal('hide')
    } else {
      setErrorMsg('Only alphabets supported')
    }
  }

  return (
    <div className='modal fade' id='selectPostCategoryModal' tabIndex='-1' role='dialog' aria-labelledby='selectPostCategoryModalLabel' aria-hidden='true'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-body pt-0'>
            <div className='text-center'>
              <img className='btn-play' src={require('assets/svgs/Accessibility.svg').default} alt='1' />
            </div>
            <div className='user-list'>
              {
                postCategories.map((obj, idx) =>
                  <div className='post-category' key={idx} onClick={e => handleCategory(obj)}>
                    <div className='username pull-left'>
                      {obj.title}
                     </div>
                    <div className={`${obj.key === category.key ? '' : 'd-none'}`}>
                      <img className='btn-play' src={require('assets/svgs/Tick.svg').default} alt='1' />
                    </div>
                  </div>
                )
              }
            </div>
            <div className={`${other ? 'other-category-box' : 'd-none'}`}>
              <textarea className='form-control' value={otherValue} onChange={e => setOtherValue(e.target.value)} placeholder='Type here' maxLength='15'></textarea>
              <small className='pull-right'>{15 - otherValue.length} chars left</small>
            </div>
            <br/>
            {errorMsg && <div className='text-danger font-small my-2'>{errorMsg}</div>}
            <div className='text-center'>
              <button className='btn btn-violet-rounded btn-sm' onClick={submitCategory}>
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailComponent
