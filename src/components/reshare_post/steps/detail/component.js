import React from 'react'

import PostComponent from 'components/show_posts/children/post/component'

const DetailComponent = ({
  postText, setPostText, currentUser, sharePost
}) => {
  const handleChange = async (val) => {
    setPostText(val)
  }

  return (
    <div>
      <div className='card create-reshare-post-card-wrapper'>
        <div className='card-body'>
          <div className='d-flex flex-row align-items-center justify-content-between'>
            <span className='text-violet'>@{currentUser.username}'s same pinch</span>
          </div>
          <textarea className='create-post-box' value={postText} onChange={e => handleChange(e.target.value)} placeholder='Type your feeling here!!' rows={3} autoFocus></textarea>
        </div>
        {
          sharePost.stories &&
          <PostComponent currentUser={currentUser} post={sharePost} reshare={true} hideEditOptions={true} />
        }
      </div>
    </div>
  )
}

export default DetailComponent
