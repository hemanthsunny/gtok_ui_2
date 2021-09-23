import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import PostComponent from 'components/show_posts/children/post/component'
import ResharePostComponent from 'components/show_posts/children/reshare/component'
import { SetPosts } from 'store/actions'
import { getQuery, firestore } from 'firebase_config'
import {
  MenuOptionsComponent,
  ShareOptionsComponent,
  ReportPostComponent,
  CreateChatComponent
} from 'components'

class PostsComponent extends Component {
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
      userId: props.currentUser.id
    }
  }

  componentDidMount () {
    if (this.props.match.params.username) {
      this.loadUser()
    }
    this.loadPosts()
  }

  UNSAFE_componentWillMount () {
    window.addEventListener('scroll', this.loadMorePosts)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.loadMorePosts)
  }

  loadUser = async () => {
    this.setState({ loading: true })
    const u = await getQuery(
      firestore.collection('users').where('username', '==', this.props.match.params.username).get()
    )
    this.setState({ displayUser: u[0], userId: u[0].id, loading: false })
    this.loadPosts()
  }

  loadPosts = async () => {
    this.setState({ loading: true })
    let posts = await getQuery(
      firestore.collection('posts').where('userId', '==', this.state.userId).orderBy('createdAt', 'desc').limit(this.state.pageId * this.state.pageLimit).get()
    )
    posts = posts.sort((a, b) => b.createdAt - a.createdAt)
    this.setState({
      pageId: 2,
      posts,
      loading: false
    })
  }

  loadMorePosts = async () => {
    this.setState({ loading: true })
    let posts = await getQuery(
      firestore.collection('posts').where('userId', '==', this.state.userId).orderBy('createdAt', 'desc').limit(this.state.pageId * this.state.pageLimit).get()
    )
    posts = posts.sort((a, b) => b.createdAt - a.createdAt)
    this.setState({
      pageId: this.state.pageId + 1,
      posts,
      loading: false
    })
  }

  subHeader = () => (
    <div className='dashboard-tabs d-none' role='navigation' aria-label='Main'>
      <div className='tabs -big'>
        <div className='tab-item -active'>Feelings</div>
        <div className='tab-item' onClick={e => this.props.setActiveTab('activities')}>Activities</div>
      </div>
    </div>
  );

  render () {
    return (
      <div className='pt-2'>
        {this.subHeader()}
        <div className='filter-wrapper d-none'>
          <div className='filter-icon' onClick={e => this.setState({ showFilters: !this.state.showFilters })}>
          Filter <img className='btn-play' src={require('assets/svgs/Filter.svg').default} alt="1" />
          </div>
          <div className={`filter-names ${this.state.showFilters ? 'show-filter-names' : 'hide-filter-names'}`}>
            {
              this.state.selectedFilters && this.state.selectedFilters.map((name, i) => (
                <div className='btn btn-violet-outline btn-sm mx-1 selected' key={i} onClick={e => this.handleFilters('unselected', name)}>{name}</div>
              ))
            }
            {
              this.state.unselectedFilters && this.state.unselectedFilters.map((name, i) => (
                <div className='btn btn-sm mx-1 unselected' key={i} onClick={e => this.handleFilters('selected', name)}>{name}</div>
              ))
            }
          </div>
        </div>
        <div className='feeling-wrapper'>
          {
            this.state.posts[0]
              ? this.state.posts.map((post, idx) => {
                if (post.anonymous && post.userId !== this.props.currentUser.id) {
                  return (<div key={idx}></div>)
                }
                if (post.resharePostId) {
                  return (
                    <ResharePostComponent currentUser={this.props.currentUser} post={post} key={idx}/>
                  )
                }
                return post.stories && (
                  <PostComponent currentUser={this.props.currentUser} post={post} key={idx}/>
                )
              })
              : <div className='text-center mt-5'>
                No assets found
              </div>
          }
          <MenuOptionsComponent currentUser={this.props.currentUser} />
          <ShareOptionsComponent currentUser={this.props.currentUser} />
          <ReportPostComponent currentUser={this.props.currentUser} />
          <CreateChatComponent currentUser={this.props.currentUser} sendTo={true}/>
          <div className={`text-center my-3 ${(this.state.posts.length <= (this.state.pageId * this.state.pageLimit)) && 'd-none'}`}>
            <button className='btn btn-violet btn-sm' onClick={this.loadMorePosts}>Load more</button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { newAlertsCount } = state.alerts
  const { newMessagesCount } = state.chatMessages
  return { newAlertsCount, newMessagesCount }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindPosts: (currentUser, type, ops) => dispatch(SetPosts(currentUser, type, ops))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PostsComponent))
