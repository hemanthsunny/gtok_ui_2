import React, { useState } from 'react'

import { get, firestore } from 'firebase_config'
import { capitalizeFirstLetter } from 'helpers'

function AdminZoneComponent ({ currentUser }) {
  const [loading, setLoading] = useState(false)
  const postCategoryKeys = [
    'current_feeling', 'happy', 'sad', 'surprise', 'fear', 'angry', 'other', 'current_activity', 'eating', 'playing', 'working', 'reading', 'watching'
  ]

  const mergePosts = async () => {
    setLoading(true)
    const result = await get('activities')
    await result.map(async (activity, idx) => {
      const data = Object.assign({
        active: true,
        type: 'activity',
        stories: [{
          text: capitalizeFirstLetter(activity.description)
        }],
        userId: activity.userId,
        followers: [],
        followersCount: 0,
        category: {
          key: 'other',
          title: activity.activity
        },
        tradePrice: 0,
        anonymous: activity.anonymous,
        createdAt: activity.createdAt,
        updatedAt: activity.updatedAt
      })
      await firestore.collection('posts').add(data)
    })
    setLoading(false)
  }

  const updateCategories = async () => {
    setLoading(true)
    const result = await get('posts')
    await result.map(async (post, idx) => {
      if (!post.resharePostId) {
        if (!postCategoryKeys.includes(post.category.key)) {
          await firestore.collection('posts').doc(post.id).update({
            category: {
              key: 'other',
              title: post.category.title
            }
          })
        }
      }
    })
    setLoading(false)
  }

  return (
    <div className='section'>
      <div className='section-header'>Admin zone { loading && <i className='fa fa-spin fa-spinner'></i> }</div>
      <ul className='section-list'>
        <li>
          <div className='d-flex flex-row align-items-center justify-content-between'>
            <span className='option-name' htmlFor="customSwitch1" onClick={updateCategories}>
              Update categories
            </span>
          </div>
        </li>
        <li>
          <div className='d-flex flex-row align-items-center justify-content-between'>
            <span className='option-name' htmlFor="customSwitch1" onClick={mergePosts}>
              Merge feelings and activities
            </span>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default AdminZoneComponent
