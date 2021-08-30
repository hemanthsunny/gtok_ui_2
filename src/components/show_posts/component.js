import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { motion } from 'framer-motion'
import './style.css'

import PostComponent from './children/post/component'
import ResharePostComponent from './children/reshare/component'
import {
  HeaderComponent,
  MobileFooterComponent,
  LoadingComponent,
  MenuOptionsComponent,
  ShareOptionsComponent,
  ReportPostComponent,
  CreateChatComponent
} from 'components'
import { SetPosts } from 'store/actions'
import { getQuery, firestore } from 'firebase_config'
import { pageVariants, pageTransition } from 'constants/framer-motion'

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
      ],
      selectedFilters: [],
      unselectedFilters: ['Feelings', 'Activities', 'Audios', 'Trade'].sort()
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
      loadMore: posts.length >= (this.state.pageId * this.state.pageLimit),
      pageId: 2,
      posts,
      loading: false
    })
    await this.bindPosts(this.props.currentUser, 'none', posts)
  }

  loadMorePosts = async (last) => {
    if (
      (window.innerHeight + document.documentElement.scrollTop >= document.scrollingElement.scrollHeight) && this.state.loadMore
    ) {
      this.setState({ loading: true })
      let posts = await getQuery(
        firestore.collection('posts').orderBy('createdAt', 'desc').limit(this.state.pageId * this.state.pageLimit).get()
      )
      posts = posts.sort((a, b) => b.createdAt - a.createdAt)
      this.setState({
        loadMore: posts.length >= (this.state.pageId * this.state.pageLimit),
        pageId: this.state.pageId + 1,
        posts,
        loading: false
      })
      await this.bindPosts(this.props.currentUser, 'none', posts)
    }
  }

  touchStart = (e) => {
    this.setState({
      touchStart: e.changedTouches[0].clientX
    })
  }

  touchEnd = (e) => {
    this.setState({
      touchEnd: e.changedTouches[0].clientX
    }, () => {
      this.handleGesture()
    })
  }

  handleGesture = (e) => {
    if (this.state.touchStart - this.state.touchEnd > 150) {
      this.props.history.push('/app/activities')
    }
  }

  handleFilters = (action, val) => {
    if (action === 'selected') {
      this.setState({
        selectedFilters: [...this.state.selectedFilters, val].sort(),
        unselectedFilters: this.state.unselectedFilters.filter(f => f !== val).sort()
      })
    } else {
      this.setState({
        unselectedFilters: [...this.state.unselectedFilters, val].sort(),
        selectedFilters: this.state.selectedFilters.filter(f => f !== val).sort()
      })
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
        <HeaderComponent />
        <div>
          <div className='dashboard-content' onTouchStart={this.touchStart} onTouchEnd={this.touchEnd}>
            {/* this.subHeader() */}
              <div className='feeling-wrapper'>
                <div className='filter-wrapper'>
                  <div className='filter-icon' onClick={e => this.setState({ showFilters: !this.state.showFilters })}>
                  Filter <img className='btn-play' src={require('assets/svgs/Filter.svg').default} alt="1" />
                  </div>
                  <div className={`filter-names ${this.state.showFilters ? 'show-filter-names' : 'hide-filter-names'}`}>
                    {
                      this.state.selectedFilters.map((name, i) => (
                        <div className='btn btn-violet-outline btn-sm mx-1 selected' key={i} onClick={e => this.handleFilters('unselected', name)}>{name}</div>
                      ))
                    }
                    {
                      this.state.unselectedFilters.map((name, i) => (
                        <div className='btn btn-sm mx-1 unselected' key={i} onClick={e => this.handleFilters('selected', name)}>{name}</div>
                      ))
                    }
                  </div>
                </div>
                {
                  this.state.posts[0] && this.state.posts.map((post, idx) => {
                    if (post.resharePostId) {
                      return (
                        <ResharePostComponent currentUser={this.props.currentUser} post={post} key={idx}/>
                      )
                    }
                    return post.stories && (
                      <PostComponent currentUser={this.props.currentUser} post={post} key={idx}/>
                    )
                  })
                }
              </div>
              <MobileFooterComponent currentUser={this.props.currentUser} />
              <MenuOptionsComponent currentUser={this.props.currentUser} />
              <ShareOptionsComponent currentUser={this.props.currentUser} />
              <ReportPostComponent currentUser={this.props.currentUser} />
              <CreateChatComponent currentUser={this.props.currentUser} sendTo={true}/>

              {this.state.loading && <LoadingComponent />}
            <motion.div initial='initial' animate='in' exit='out' variants={pageVariants} transition={pageTransition}>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { posts, sharePost } = state.posts
  return { posts, sharePost }
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
