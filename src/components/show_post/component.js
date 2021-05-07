import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import HeaderComponent from './header'
import PostComponent from './post/component'

import {
  SidebarComponent,
  LoadingComponent
} from 'components'
import { SetPosts } from 'store/actions'
import { getId } from 'firebase_config'

class ParentComponent extends Component {
  constructor (props) {
    super(props)
    this.bindPosts = props.bindPosts
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

  onSortOptionChange = async (val) => {
    await this.bindPosts(this.props.currentUser, 'all', { sort: val })
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
    <div className='dashboard-tabs' role='navigation' aria-label='Main'>
      <div className='tabs -big'>
        <Link to='/app/posts' className='tab-item -active'>Feelings</Link>
        <Link to='/app/activities' className='tab-item'>Activities</Link>
      </div>
    </div>
  );

  render () {
    return (
      <div>
        <HeaderComponent newAlertsCount={this.props.newAlertsCount} newMessagesCount={this.props.newMessagesCount} />
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
              {this.state.post && this.state.post.status !== 404 && <PostComponent currentUser={this.props.currentUser} post={this.state.post}/>}
              <div className='text-center my-4'>
                <button className='btn btn-violet btn-sm' onClick={this.props.history.goBack}>Go Back</button>
              </div>
            </div>
            {this.state.loading && <LoadingComponent />}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { posts } = state.posts
  const { newAlertsCount } = state.alerts
  const { newMessagesCount } = state.chatMessages
  return { posts, newAlertsCount, newMessagesCount }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindPosts: (currentUser, type, ops) => dispatch(SetPosts(currentUser, type, ops))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ParentComponent))
