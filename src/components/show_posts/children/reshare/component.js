import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import './style.css'

import { getId } from 'firebase_config'
import PostComponent from 'components/show_posts/children/post/component'
import { CustomImageComponent } from 'components'

const ParentComponent = ({
  currentUser, post, allUsers
}) => {
  const [postedUser, setPostedUser] = useState('')
  const [resharePost, setResharePost] = useState('')

  useEffect(() => {
    async function getPostedUser () {
      let result = allUsers.find(user => user.id === post.userId)
      if (!result) {
        result = await getId('users', post.userId)
      }
      result.id = post.userId
      setPostedUser(result)
    }
    if (!postedUser) {
      getPostedUser()
    }

    async function getResharePost () {
      const result = await getId('posts', post.resharePostId)
      result.id = post.resharePostId
      setResharePost(result)
    }
    if (!resharePost) {
      getResharePost()
    }
  }, [post, allUsers, resharePost, setResharePost])

  return (
    <div className='d-flex ml-2 mt-3 mb-4'>
      <div>
        <CustomImageComponent user={postedUser} size='sm' />
      </div>
      <div className='card reshare-post-card-wrapper'>
        <div className='card-body pb-3'>
          <div className='d-flex flex-row align-items-center justify-content-between'>
            <div className='text-violet'>@{postedUser.username}'s same pinch</div> <br/>
            <div className='created-at'>{moment(post.createdAt).format('h:mm a')} &middot; {moment(post.createdAt).format('D MMM \'YY')}</div>
          </div>
          <div className='mt-2'>
            {post.stories[0].text}
          </div>
        </div>
        {
          resharePost.stories && (
            <PostComponent currentUser={currentUser} post={resharePost} reshare={true}/>
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
