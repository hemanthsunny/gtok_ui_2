import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import './style.css'

import { getId } from 'firebase_config'
import { CreatePostComponent } from 'components'
import { SetNewPost } from 'store/actions'

const ParentComponent = (props) => {
  const sharePost = (props.history.location.state && props.history.location.state.sharePost) || {}

  const { currentUser } = props
  const [resharePost, setResharePost] = useState('')
  const [resharePostUser, setResharePostUser] = useState('')

  useEffect(() => {
    async function getResharePostUser (post) {
      const res = await getId('users', post.userId)
      setResharePostUser(res)
    }

    async function getResharePost () {
      const res = await getId('posts', sharePost.resharePostId)
      res.id = sharePost.resharePostId
      setResharePost(res)
      getResharePostUser(res)
    }

    if (!resharePost && sharePost && !!sharePost.resharePostId) {
      getResharePost()
    } else if (!resharePost && sharePost) {
      getResharePostUser(sharePost)
    }
  })

  return (
    <div>
      {
        sharePost.resharePostId && resharePost
          ? <CreatePostComponent currentUser={currentUser} createResharePost={true} resharePost={resharePost} resharePostUser={resharePostUser} />
          : <CreatePostComponent currentUser={currentUser} createResharePost={true} resharePost={sharePost} resharePostUser={resharePostUser} />
      }
    </div>
  )
}

const mapStateToProps = (state) => {
  const { relations } = state.relationships
  const { wallet } = state.wallet
  const { prices } = state.prices
  return { relations, wallet, prices }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindNewPost: (content) => dispatch(SetNewPost(content))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ParentComponent))
