import React, { useState, useEffect } from 'react'
import './style.css'

import DoughnutChart from './doughnut/component'
import { categories, categoryColors } from 'constants/categories'
import { capitalizeFirstLetter } from 'helpers'
import { getQuery, firestore } from 'firebase_config'

function ProfileGraphsComponent ({
  currentUser
}) {
  const [data, setData] = useState()
  const labels = categories.map((elem, idx) => {
    if (elem.key === 'angry') {
      return 'Anger'
    }
    elem = elem.key && capitalizeFirstLetter(elem.key.replace('_', ' '))
    return elem
  })

  useEffect(() => {
    async function getUserAssets () {
      const posts = await getQuery(
        firestore.collection('posts').where('userId', '==', currentUser.id).get()
      )
      if (posts.length > 0) {
        setData([
          posts?.filter(elem => elem.category && (elem.category.key === 'current_feeling' || elem.category.key === 'same_pinch')).length,
          posts?.filter(elem => elem.category && elem.category.key === 'happy').length,
          posts?.filter(elem => elem.category && elem.category.key === 'sad').length,
          posts?.filter(elem => elem.category && elem.category.key === 'surprise').length,
          posts?.filter(elem => elem.category && elem.category.key === 'fear').length,
          posts?.filter(elem => elem.category && elem.category.key === 'angry').length,
          posts?.filter(elem => elem.category && elem.category.key === 'special').length,
          posts?.filter(elem => elem.category && elem.category.key === 'other').length
        ])
      }
    }
    if (!data) {
      getUserAssets()
    }
  })

  return (
    <div className='profile-graphs-container'>
      {
        data && data.length > 0 &&
        <div className='graphs'>
          <DoughnutChart labels={labels} data={data} title='Wheel Of Emotions' colors={categoryColors} />
        </div>
      }
    </div>
  )
}

export default ProfileGraphsComponent
