import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import HeaderComponent from './header'

import PostComponent from '../show_posts/children/post/component'
import { LoadingComponent } from 'components'
import { SetPosts } from 'store/actions'
import { capitalizeFirstLetter } from 'helpers'
import { gtokFavicon, gtokBot } from 'images'
import { getQuery, firestore } from 'firebase_config'

class UserPostsComponent extends Component {
  constructor (props) {
    super(props)
    this.bindPosts = props.bindPosts
    this.propsState = props.history.location.state || {}
    this.state = {
      posts: props.posts,
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
      userId: props.match.params.user_id
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
      firestore.collection('posts').where('userId', '==', this.state.userId).orderBy('createdAt', 'desc').limit(this.state.pageLimit).get()
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
    <div className='d-flex flex-row justify-content-around feeling-sub-header'>
      <div>
        <Link to={`/app/profile/${this.state.userId}/posts`} className=''>Feeling</Link>
      </div>
      <div>
        <Link to={`/app/profile/${this.state.userId}/activities`} className=''>Activity</Link>
      </div>
    </div>
  );

  render () {
    return (
      <div>
        <HeaderComponent userId={this.state.userId}/>
        {this.subHeader()}
        <div className='container'>
          <div className='row feeling-wrapper'>
            <div className='d-none col-md-2 d-md-block mt-2'>
              <div className='card left-sidebar-wrapper'>
                <div className='card-body'>
                  <div className='profile-details'>
                    <Link to='/app/profile'>
                      <img
                        src={this.props.currentUser.photoURL || gtokFavicon}
                        alt='dp'
                        className='profile-pic'
                      />
                      <h5 className='profile-name'>
                        {this.props.currentUser.displayName && capitalizeFirstLetter(this.props.currentUser.displayName)}
                      </h5>
                    </Link>
                  </div>
                  <hr/>
                  <div className='d-flex create-post'>
                    <Link to='/app/create_post'>
                      <i className='fa fa-pencil'></i> &nbsp;
                      <small className='bot-text'>Share an experience</small>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-xs-12 col-md-7'>
              <div className='d-none d-md-block card create-post-card mt-2'>
              {/*
                <div className='d-flex'>
                  <div className='col-6 font-xs-small card p-2 create-post-card-type' style={{backgroundColor: (this.state.postType !== 'bot' ? '#eee' : 'white')}} onClick={e => this.setState({postType: 'human'})}><i className='fa fa-pencil'></i>&nbsp;Type a post</div>
                  <div className='col-6 font-xs-small card p-2 create-post-card-type' style={{backgroundColor: (this.state.postType === 'bot' ? '#eee' : 'white')}} onClick={e => this.setState({postType: 'bot'})}>Automate a post</div>
                </div>
              */}
                <div className='d-flex'>
                  <div className='col-12 font-xs-small card p-2 create-post-card-type' style={{ backgroundColor: 'white' }} onClick={e => this.props.history.push('/app/create_post')}>
                    <div className='d-flex align-self-center'>
                      <i className='fa fa-pencil pr-1 mt-1'></i> &nbsp;
                      <span>Share an experience / Pinch a feeling. Click here</span>
                    </div>
                  </div>
                </div>
                {/*
                  postType === 'bot' &&
                  <div className=''>
                    <p className='p-3 px-md-5 text-center text-secondary'>
                    Answer few questions and our Gtok Bot generates a post for you.<br/>
                    <button className='btn btn-link text-center' onClick={e => setGeneratePost(true)}>
                    Generate Post
                    </button>
                    </p>
                  </div> */
                }
              </div>
              {/* <SortComponent options={this.state.sortOptions} onChange={this.onSortOptionChange}/> */}
              <div className='mt-3'>
                {
                  this.state.posts[0] && this.state.posts.map((post, idx) => post.stories && (
                    <PostComponent currentUser={this.props.currentUser} post={post} key={idx}/>
                  ))
                }
              </div>
            </div>
            <div className='d-none col-md-3 d-md-block mt-2'>
              <div className='card right-sidebar-wrapper'>
                <div className='card-body'>
                  <div className='d-flex profile-bot'>
                    <img src={gtokBot} alt='gtokBot' className='bot-icon' />
                    <small className='bot-text'>Your personal friend</small>
                  </div>
                  <hr/>
                  <p className='profile-bot-description'>
                    Hi! I am your personal friend (a bot). I can chat, work and help you in daily activities. I am so happy to be your personal friend, {this.props.currentUser.displayName.split(' ')[0].toUpperCase()}. Will ping you once I am ready to chat...
                  </p>
                </div>
              </div>
            </div>
            {/*
              generatePost && <GeneratePostComponent setOpenModal={setGeneratePost} currentUser={currentUser} />
            */}
          </div>
          {this.state.loading && <LoadingComponent />}
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
)(withRouter(UserPostsComponent))
