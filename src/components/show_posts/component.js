import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import HeaderComponent from './header'
import PostComponent from './children/post/component'

import {
  SidebarComponent,
  LoadingComponent
} from 'components'
import { SetPosts } from 'store/actions'
import { getQuery, firestore } from 'firebase_config'

class ParentComponent extends Component {
  constructor (props) {
    super(props)
    this.bindPosts = props.bindPosts
    this.propsState = props.history.location.state || {}
    this.state = {
      posts: [],
      generatePost: false,
      reloadPosts: this.propsState.reloadPosts || false,
      pageId: 1,
      pageLimit: 10,
      sortOptions: [
        { key: 'recent', val: 'Most Recent', checked: true },
        { key: 'oldest', val: 'Most Oldest' },
        { key: 'category_asc', val: 'Category (A-Z)' },
        { key: 'category_desc', val: 'Category (Z-A)' }
      ]
    }
  }

  componentDidMount () {
    if (!this.state.posts[0] || this.state.reloadPosts) {
      this.loadPosts()
      this.setState({
        reloadPosts: false
      })
    }
    // if (!posts[0]) bindPosts(currentUser);
    // if (this.state.reloadPosts) {
    //   this.bindPosts(this.props.currentUser);
    //   this.setState({
    //     reloadPosts: false
    //   });
    // }
  }

  UNSAFE_componentWillMount () {
    window.addEventListener('scroll', this.loadMorePosts)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.loadMorePosts)
  }

  onSortOptionChange = async (val) => {
    await this.bindPosts(this.props.currentUser, 'all', { sort: val })
  }

  loadPosts = async () => {
    this.setState({ loading: true })
    let posts = await getQuery(
      firestore.collection('posts').orderBy('createdAt', 'desc').limit(this.state.pageLimit).get()
    )
    posts = posts.sort((a, b) => b.createdAt - a.createdAt)
    this.setState({
      pageId: 2,
      posts,
      loading: false
    })
    await this.bindPosts(this.props.currentUser, 'none', posts)
  }

  loadMorePosts = async (last) => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.scrollingElement.scrollHeight
    ) {
      this.setState({ loading: true })
      let posts = await getQuery(
        firestore.collection('posts').orderBy('createdAt', 'desc').limit(this.state.pageId * this.state.pageLimit).get()
      )
      posts = posts.sort((a, b) => b.createdAt - a.createdAt)
      this.setState({
        pageId: this.state.pageId + 1,
        posts,
        loading: false
      })
      await this.bindPosts(this.props.currentUser, 'none', posts)
    }
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
                this.state.posts[0] && this.state.posts.map((post, idx) => post.stories && (
                  <PostComponent currentUser={this.props.currentUser} post={post} key={idx}/>
                ))
              }
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
