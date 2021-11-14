import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import $ from 'jquery'
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
    /* Onload hide scroll-to-top butotn */
    $('.scroll-to-top').css('display', 'none')
  }

  UNSAFE_componentWillMount () {
    window.addEventListener('scroll', this.loadMorePosts)
    window.addEventListener('scroll', this.updateScrollPosition)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.loadMorePosts)
    window.removeEventListener('scroll', this.updateScrollPosition)
  }

  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  updateScrollPosition = () => {
    if (window.pageYOffset > 200) {
      $('.scroll-to-top').fadeIn()
    } else {
      $('.scroll-to-top').fadeOut()
    }
  }

  checkRelationships = (posts) => {
    setTimeout(() => {
      if (this.props.relations) {
        const rlns = this.props.relations.filter(rln => rln.userIdOne === this.props.currentUser.id && rln.status === 1)
        const rlnIds = rlns.map(rln => rln.userIdTwo)
        return posts.filter(p => {
          if (rlnIds.indexOf(p.userId) > -1) {
            return p
          }
          return null
        }).filter(el => el)
      }
    }, 3000)
    return posts
  }

  checkFilters = (posts) => {
    if (this.state.selectedFilters[0]) {
      posts = posts.filter(p => p.category && this.state.selectedFilters.indexOf(p.category.title) > -1)
    }
    return posts
  }

  loadPosts = async () => {
    this.setState({ loading: true })
    let posts = await getQuery(
      firestore.collection('posts').where('active', '==', true).orderBy('createdAt', 'desc').limit(this.state.pageLimit).get()
    )
    posts = await this.checkRelationships(posts)
    posts = await this.checkFilters(posts)
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
        firestore.collection('posts').where('active', '==', true).orderBy('createdAt', 'desc').limit(this.state.pageId * this.state.pageLimit).get()
      )
      posts = await this.checkRelationships(posts)
      posts = await this.checkFilters(posts)
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

  handleFilters = (action, val) => {
    if (action === 'selected') {
      this.setState({
        selectedFilters: Array.from(new Set([...this.state.selectedFilters, val])).sort(),
        unselectedFilters: this.state.unselectedFilters.filter(f => f !== val).sort()
      })
    } else {
      this.setState({
        unselectedFilters: [...this.state.unselectedFilters, val].sort(),
        selectedFilters: this.state.selectedFilters.filter(f => f !== val).sort()
      })
    }
    this.scrollToTop()
    this.loadPosts()
  }

  handleResharePostUser = (user) => {
    this.setState({
      resharePostUser: user
    })
  }

  subHeader = () => (
    <div className='dashboard-tabs' role='navigation' aria-label='Main'>
      <div className='tabs -big'>
        <Link to='/app/assets' className='tab-item -active'>Feelings</Link>
        <Link to='/app/activities' className='tab-item'>Activities</Link>
      </div>
    </div>
  );

  render () {
    return (
      <div>
        {!this.props.hideHeader && <HeaderComponent />}
        <div>
          <div className='dashboard-content' onTouchStart={this.touchStart} onTouchEnd={this.touchEnd}>
            {/* this.subHeader() */}
              <div className='feeling-wrapper'>
                <div className='filter-wrapper d-none'>
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
                <div className='filter-wrapper pl-sm-5'>
                {
                  this.state.selectedFilters.map((name, i) => (
                    <div className='btn btn-violet btn-sm mx-1 selected-filter' key={i} onClick={e => this.handleFilters('unselected', name)}>{name} &nbsp; <>x</></div>
                  ))
                }
                </div>
                {
                  this.state.posts[0] && this.state.posts.map((post, idx) => {
                    if (post.resharePostId) {
                      return (
                        <ResharePostComponent currentUser={this.props.currentUser} post={post} key={idx} handleFilters={this.handleFilters} handleResharePostUser={this.handleResharePostUser}/>
                      )
                    }
                    return post.stories && (
                      <PostComponent currentUser={this.props.currentUser} post={post} key={idx} handleFilters={this.handleFilters}/>
                    )
                  })
                }
                <div className='text-center mt-5'>
                  Follow our <Link to='/app/search' className='text-violet'>priority users</Link> to view their assets.
                </div>
                {this.state.loading && <LoadingComponent />}
                <div className='scroll-to-top' onClick={this.scrollToTop}>
                  Scroll to top
                </div>
              </div>
              <MobileFooterComponent currentUser={this.props.currentUser} />
              <MenuOptionsComponent currentUser={this.props.currentUser} loadPosts={this.loadPosts} />
              <ShareOptionsComponent currentUser={this.props.currentUser} resharePostUser={this.state.resharePostUser} />
              <ReportPostComponent currentUser={this.props.currentUser} />
              <CreateChatComponent currentUser={this.props.currentUser} sendTo={true}/>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { posts, sharePost } = state.posts
  const { relations } = state.relationships
  return { posts, sharePost, relations }
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
