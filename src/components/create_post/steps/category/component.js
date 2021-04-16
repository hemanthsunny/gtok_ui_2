import React from 'react'

const DetailComponent = ({ currentUser, setStepNumber, handleChange, category, setCategory, postCategories }) => {
  const handleCategory = async (val) => {
    if (val) {
      const cat = postCategories.find(c => c.title === val)
      setCategory(cat)
    }
  }

  return (
    <div className='feeling-category-wrapper'>
      <div className='mb-3'>
        <select className='custom-select font-small' id='category' onChange={e => handleCategory(e.target.value)} value={category && category.title}>
          <option>Select category</option>
          {
            postCategories.map(category => (
              <option value={category.title} key={category.key}>
              {category.title}
              </option>
            ))
          }
        </select>
      </div>
      <div className={`input-group mb-3 ${!currentUser.eligibleToPremium && 'd-none'}`}>
        <div className='input-group-prepend'>
          <label className='input-group-text font-small' htmlFor='visibleTo'>Visible to</label>
        </div>
        <select className='custom-select font-small' id='visibleTo'>
          <option defaultValue value='public'>Everyone</option>
          <option value='premium'>Premium users only</option>
        </select>
      </div>
    </div>
  )
}

export default DetailComponent
