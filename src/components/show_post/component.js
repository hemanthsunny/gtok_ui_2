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
              {this.state.post && <PostComponent currentUser={this.props.currentUser} post={this.state.post}/>}
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
