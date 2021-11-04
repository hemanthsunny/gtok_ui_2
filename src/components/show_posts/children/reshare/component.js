import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import './style.css'

import { getId } from 'firebase_config'
import PostComponent from '../post/component'
import { CustomImageComponent } from 'components'

const ParentComponent = ({
  currentUser, post, allUsers, handleFilters
}) => {
  const [postedUser, setPostedUser] = useState('')
  const [resharePost, setResharePost] = useState('')
  const [resharePostUser, setResharePostUser] = useState('')
  const history = useHistory()

  useEffect(() => {
    async function getPostedUser () {
      let result = allUsers.find(user => user.id === post.userId)
      if (!result) {
        result = await getId('users', post.userId)
      }
      result.id = post.userId
      setPostedUser(result)
    }
    // if (!postedUser) {
    //   getPostedUser()
    // }
    async function getResharePostUser (p) {
      let result = allUsers.find(user => user.id === p.userId)
      if (!result) {
        result = await getId('users', p.userId)
      }
      result.id = p.userId
      setResharePostUser(result)
    }

    async function getResharePost () {
      const result = await getId('posts', post.resharePostId)
      result.id = post.resharePostId
      setResharePost(result)
      getPostedUser()
      getResharePostUser(result)
    }
    if (!resharePost) {
      getResharePost()
    }
  }, [post, allUsers, resharePost, setResharePost])

  const redirectToProfile = () => {
    history.push('/app/profile/' + postedUser.username)
  }

  return postedUser && resharePost && (
    <div className='d-flex ml-2 mt-3 mb-4'>
      <div>
        <CustomImageComponent user={postedUser} size='sm' />
      </div>
      <div className='card reshare-post-card-wrapper'>
        <div className='card-body pb-3'>
          <div className='d-flex flex-row align-items-center justify-content-between'>
            <span className='card-badge' onClick={e => handleFilters('selected', resharePost.category.title)}>{resharePost.category && resharePost.category.title}</span>
            <div className='created-at'>{moment(resharePost.createdAt).format('h:mm a')} &middot; {moment(resharePost.createdAt).format('D MMM \'YY')}</div>
          </div>
          <div className='mt-2'>
            {resharePost.stories[0].text}
          </div>
          <div className='mt-2 author text-violet'>
            {resharePost.anonymous ? <span>@anonymous</span> : <span onClick={redirectToProfile}>@{resharePostUser.username}</span>}
          </div>
        </div>
        {
          post.stories && (
            <PostComponent currentUser={currentUser} post={post} reshare={true}/>
          )
        }
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { allUsers } = state.users
  return { allUsers }
}

export default connect(
  mapStateToProps,
  null
)(ParentComponent)
