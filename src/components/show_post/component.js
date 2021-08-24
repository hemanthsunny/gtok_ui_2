import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
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
      loading: true
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
