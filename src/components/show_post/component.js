import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import {
  FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton, LinkedinIcon, LinkedinShareButton
} from 'react-share'
import './style.css'

import HeaderComponent from 'components/common/header/component'
import PostComponent from 'components/show_posts/children/post/component'
import {
  SidebarComponent,
  LoadingComponent
} from 'components'
import { getId } from 'firebase_config'

class ParentComponent extends Component {
  constructor (props) {
    super(props)
    this.propsState = props.history.location.state || {}
    this.state = {
      postId: props.computedMatch.params.post_id,
      post: '',
      loading: true,
      postUrl: process.env.REACT_APP_URL + '/' + props.computedMatch.params.post_id
    }
  }

  componentDidMount () {
    this.loadPost()
  }

  loadPost = async () => {
    const id = this.props.computedMatch.params.post_id
    const post = await getId('posts', id)
    post.id = id
    this.setState({
      post,
      loading: false
    })
  }

  subHeader = () => (
    <div className='show-post-subheader' aria-label='Subheader'>
      <Link to='/'>
        <img src={require('assets/svgs/LeftArrow.svg').default} className='go-back-icon' alt='LeftArrow' />
      </Link>
      <div className='page-name'>
        Feeling/Activity
      </div>
    </div>
  );

  render () {
    return (
      <div>
        <HeaderComponent />
        <div>
          <SidebarComponent currentUser={this.props.currentUser} />
          <div className='dashboard-content'>
            {this.subHeader()}
            <div className='feeling-wrapper'>
              {
                this.state.post.status === 404 &&
                <div className='text-center mt-5 pt-5 pb-3 text-gray-6'>
                  <i className='fa fa-trash fa-2x'></i><br/>
                  <h5 className="pt-4">Oh no! The post has been removed.</h5>
                </div>
              }
              {this.state.post && this.state.post.status !== 404 &&
                <div className='pt-5'>
                  <PostComponent currentUser={this.props.currentUser} post={this.state.post}/>
                  <div className='text-center'>
                    <FacebookShareButton url={this.state.postUrl} title={this.state.post.category.title} quote={this.state.post.text} hashtag='#letsgtok' className='socialMediaButton'>
                      <FacebookIcon size={36}/>
                    </FacebookShareButton>
                    <TwitterShareButton url={this.state.postUrl} title={this.state.post.text} hashtags='#letsgtok' className='socialMediaButton'>
                     <TwitterIcon size={36} />
                   </TwitterShareButton>
                   <WhatsappShareButton url={this.state.postUrl} title={this.state.post.text} separator=':: ' className='socialMediaButton'>
                     <WhatsappIcon size={36} />
                   </WhatsappShareButton>
                   <LinkedinShareButton url={this.state.postUrl} title={this.state.post.text} summary={this.state.post.category.title} source='Lets Gtok' className='socialMediaButton'>
                     <LinkedinIcon size={36} />
                   </LinkedinShareButton>
                  </div>
                </div>
              }
            </div>
            {this.state.loading && <LoadingComponent />}
          </div>
        </div>
      </div>
    )
  }
}

export default (withRouter(ParentComponent))
