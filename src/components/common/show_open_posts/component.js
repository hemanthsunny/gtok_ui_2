import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import moment from 'moment'

import HeaderComponent from './header'
import { PostCategories } from 'constants/categories'
import { getQuery, firestore } from 'firebase_config'

const ParentComponent = (props) => {
  const [posts, setPosts] = useState([])
  const history = useHistory()

  useEffect(() => {
    async function loadPosts () {
      let posts = await getQuery(
        firestore.collection('posts').orderBy('createdAt', 'desc').limit(20).get()
      )
      posts = posts.sort((a, b) => b.createdAt - a.createdAt)
      setPosts(posts)
    }
    loadPosts()
  }, [])

  const selectCategory = (id) => {
    const category = PostCategories.find(c => c.id === id)
    return category.title
  }

  const redirectToLogin = (txt) => {
    if (window.confirm(`Login to ${txt}`)) {
      history.push('/login')
    }
  }

  const subHeader = () => (
    <div className='dashboard-tabs' role='navigation' aria-label='Main'>
      <div className='tabs -big'>
        <Link to='/posts' className='tab-item -active'>Feelings</Link>
        <Link to='/activities' className='tab-item'>Activities</Link>
      </div>
    </div>
  )

  return (
      <div>
        <HeaderComponent />
        <div className='dashboard-content -open-route'>
          <div className='feeling-wrapper'>
            {subHeader()}
            {
              posts[0] && posts.map((post, idx) => post.stories && !post.premium && (
                <div className='card post-card-wrapper' key={idx}>
                  <div>
                    <span className='card-badge'>{selectCategory(post.categoryId)}</span>
                    <div className='card-follow'>
                      <button className='btn btn-link p-0 pr-2' onClick={e => redirectToLogin('pinch')}>
                        <i className='fa fa-heart'></i>
                      </button>
                    </div>
                  </div>
                  <div className='card-body'>
                    <p className='white-space-preline' onClick={e => redirectToLogin('view the entire story')}>
                      {post.stories[0].text.length <= 200
                        ? post.stories[0].text
                        : <span className='pointer'>{post.stories[0].text.slice(0, 199)} <small>. . . See full story</small></span>
                      }
                    </p>
                    <div className='clearfix my-4'></div>
                    <div className='media card-details'>
                      <div className='media-body'>
                        <h6>
                          <span onClick={e => redirectToLogin('see who wrote this post.')}>@Anonymous</span>
                          <div className='edit-options'>
                            <button className='btn btn-link btn-sm ml-2 fs-15 text-secondary' onClick={e => redirectToLogin('share the link.')}>
                              <i className='fa fa-share-alt'></i>
                            </button>
                          </div>
                        </h6>
                        <span className='created-at'>
                          {moment(post.createdAt).fromNow()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
            <div className='extra-section'>
              <Link to='/login' className='btn btn-violet'>Unleash more emotions</Link> <br/>
              <img className='mr-3 ' src={require('assets/svgs/celebrations.svg').default} alt='6' />
            </div>
          </div>
        </div>
      </div>
  )
}

export default ParentComponent
