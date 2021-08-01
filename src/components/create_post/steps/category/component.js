import React, { useState } from 'react'
// import $ from 'jquery'

const DetailComponent = ({ currentUser, setStepNumber, handleChange, category, setCategory, postCategories }) => {
  const [other, setOther] = useState('')
  const [otherValue, setOtherValue] = useState('')

  const handleCategory = async (cat) => {
    if (cat) {
      setCategory(cat)
      if (cat.key === 'other') {
        setOther(true)
      } else {
        setOther(false)
        window.$('#selectPostCategoryModal').modal('hide')
      }
    }
  }

  const submitCategory = () => {
    if (category.key === 'other') {
      setCategory({
        title: otherValue.trim() ? otherValue : 'Other',
        key: 'other'
      })
    }
    window.$('#selectPostCategoryModal').modal('hide')
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
              <textarea className='form-control' value={otherValue} onChange={e => setOtherValue(e.target.value)} placeholder='Type here'></textarea>
            </div>
            <div className='text-center mt-3'>
              <button className='btn btn-violet btn-sm' onClick={submitCategory}>
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
