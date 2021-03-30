import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
import HeaderComponent from './header'

import { capitalizeFirstLetter } from 'helpers'
import { SidebarComponent, LoadingComponent } from 'components'
import { SetChatMessages, SetNewMessagesCount } from 'store/actions'
import { gtokFavicon } from 'images'
import { add, getQuery, getId, update, firestore, timestamp } from 'firebase_config'

class ParentComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: '',
      messagesList: [],
      convoId: props.match.params.id,
      currentUser: props.currentUser,
      copied: false,
      autoFocus: false
    }
    this.unsubscribe = ''
    // this.messagesList = [];
    this.bindMessages = props.bindMessages
    this.bindNewMessagesCount = props.bindNewMessagesCount
    this.scrollRef = React.createRef()
  }

  componentDidMount () {
    this.getSelectedConversation()
    this.scrollToBottom()
  }

  componentDidUpdate () {
    this.scrollToBottom()
  }

  componentWillUnmount () {
    this.unsubscribe && this.unsubscribe()
  }

  getSelectedConversation = async (id) => {
    if (!id) { id = this.state.convoId }
    const result = await getId('conversations', id)
    result.id = id
    const chatUser = result.usersRef.find(u => u.id !== this.state.currentUser.id)
    let status = null
    if (this.props.relations[0]) {
      const rln = this.props.relations.find(rln => rln.userIdOne === this.state.currentUser.id && rln.userIdTwo === chatUser.id)
      if (rln && rln.status) { status = rln.status }
    } else {
      const rln = await getQuery(
        firestore.collection('userRelationships').where('userIdOne', '==', this.state.currentUser.id).where('userIdTwo', '==', chatUser.id).get()
      )
      if (rln[0] && rln[0].status) { status = rln[0].status }
    }
    this.setState({
      convoId: id,
      conversation: result,
      chatUser,
      status,
      chatUserLastSeen: chatUser.lastSeen.seconds
    })
    this.getMessagesSnapshot()
  }

  scrollToBottom = (e) => {
    setTimeout(() => {
      // this.scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Alternative option: https://stackoverflow.com/questions/43441856/how-to-scroll-to-an-element
      window.scrollTo(0, this.scrollRef.current.offsetTop)
    }, 1000)
  }

  updateConvo = async (data = {}) => {
    // Simplify these lines of code in future
    let chatUserRefs = this.state.conversation.usersRef
    chatUserRefs = chatUserRefs.map((user) => {
      if (user.id === this.state.currentUser.id) {
        user.lastSeen = new Date()
        user.displayName = this.state.currentUser.displayName
        user.photoURL = this.state.currentUser.photoURL
        user.unread = false
      } else {
        if (data.newMessage) {
          user.unread = true
          delete data.newMessage
        }
      }
      return user
    })
    await update('conversations', this.state.conversation.id, Object.assign(
      this.state.conversation,
      data,
      {
        usersRef: chatUserRefs
      }
    ))
    this.bindNewMessagesCount(this.state.currentUser)
  }

  getMessagesSnapshot = async () => {
    let messagesList = []
    this.setState({ loading: true, messagesList: [] })
    this.unsubscribe = await firestore.collection('messages')
      .where('conversationId', '==', this.state.convoId)
      .orderBy('timestamp')
      .onSnapshot(async (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const msg = change.doc.data()
            msg.id = change.doc.id
            messagesList.push(msg)
          }
        })
        messagesList = _.uniqBy(messagesList, 'id')
        this.setState({
          loading: false,
          messagesList
        })
        await this.updateConvo()
        // this.bindMessages(this.messagesList.sort((a,b) => a.createdAt - b.createdAt));
      })
    return this.unsubscribe
  }

  handleKeyPress = (e) => {
    // if (e.key === 'Enter' && e.key === 'Shift') {
    //   e.default();
    // } else if (e.key === 'Enter') {
    //   this.sendMessage();
    // }
  }

  sendMessage = async () => {
    if (this.state.status !== 1) {
      alert('You must follow this user in order to send a message.')
      return null
    }
    if (!this.state.message.trim()) { return }
    const data = {
      conversationId: this.state.conversation.id,
      text: this.state.message.trim(),
      users: this.state.conversation.users,
      admin: this.state.currentUser.id,
      timestamp
    }
    await add('messages', data)
    await this.updateConvo({
      lastMessage: this.state.message,
      lastMessageTime: timestamp,
      newMessage: true
    })
    this.setState({
      message: '',
      autoFocus: true
    })
  }

  isMsgAdmin = (adminId) => {
    return adminId !== this.state.currentUser.id
  }

  copyText = (text) => {
    navigator.clipboard.writeText(text)
    this.setState({ copied: true })
    setTimeout(() => {
      this.setState({ copied: false })
    }, 1500)
  }

  shareText = (text) => {
    this.props.history.push({
      pathname: '/app/create_post',
      state: { sharePostText: text }
    })
  }

  copiedTextAlert = () => (
    <div className='page-top-alert'> Copied </div>
  );

  renderMessageWindow = () => (
    <div className='chat-window'>
      {
        this.state.loading
          ? <LoadingComponent />
          : this.state.messagesList[0]
            ? this.state.messagesList.map((msg, idx) => (
            <div className='chat-messages' key={idx}>
              <div className={`${this.isMsgAdmin(msg.admin) ? 'sender ml-2' : 'receiver'} mt-3 white-space-preline`}>
                {msg.text}
                <div className='msg-header'>
                  <small className='pull-left msg-datetime'>{moment(msg.createdAt).format('HH:mm DD/MM/YY')}</small>
                  <div className='dropdown p-0 pull-right'>
                    <i className='fa fa-angle-down msg-menu-icon' data-toggle='dropdown'></i>
                    <div className='dropdown-menu'>
                      <button className='dropdown-item btn-link' onClick={e => this.copyText(msg.text)}>
                        <i className='fa fa-copy'></i>&nbsp;
                        Copy text
                      </button>
                      <button className='dropdown-item btn-link' onClick={e => this.shareText(msg.text)}>
                        <i className='fa fa-share'></i> &nbsp; Share via Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ))
            : <div className='text-center text-secondary'> No messages yet </div>
      }
      <div ref={this.scrollRef}></div>
    </div>
  )

  setDefaultImg = (e) => {
    e.target.src = gtokFavicon
  }

  subHeader = () => (
    <div className='dashboard-tabs' role='navigation' aria-label='Main'>
      <div className='tabs -big'>
        <Link to='/app/chats' className='tab-item'>
          Back
        </Link>
        <div className='tab-item -active'>
          {this.state.conversation && this.state.chatUser
            ? <div className='text-center'>
              {this.state.conversation.groupName || capitalizeFirstLetter(this.state.chatUser.displayName)}<br/>
              {
                this.state.chatUser.lastSeen &&
                <small>
                  Last active {this.state.chatUserLastSeen && moment.unix(this.state.chatUserLastSeen).format('HH:mm DD/MM/YYYY')}
                </small>
              }
            </div>
            : <LoadingComponent />
          }
        </div>
      </div>
    </div>
  );

  render () {
    return (
      <div>
        <HeaderComponent newAlertsCount={this.props.newAlertsCount} newMessagesCount={this.props.newMessagesCount} />
        <div>
          <SidebarComponent currentUser={this.props.currentUser} />
          <div className='dashboard-content -opts'>
            {this.subHeader()}
            <div className='mob-single-chat-window'>
              {this.state.copied && this.copiedTextAlert() }
              {
                this.state.conversation && this.state.chatUser
                  ? (
                  <div>
                    {this.renderMessageWindow()}
                    <div className='chat-window-footer'>
                      <div className='p-2 d-none'>
                        <i className='fa fa-paperclip'></i>
                      </div>
                      <div className='flex-grow-1 p-2'>
                        <textarea className='reply-box' rows='1' placeholder='Write message here..' value={this.state.message} onChange={e => this.setState({ message: e.target.value })} onKeyPress={e => this.handleKeyPress(e)} autoFocus={this.state.autoFocus}>
                        </textarea>
                      </div>
                      <div className='p-2'>
                        <i className='fa fa-paper-plane' onClick={e => this.sendMessage()}></i>
                      </div>
                    </div>
                  </div>
                    )
                  : <LoadingComponent />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { messages } = state.chatMessages
  const { relations } = state.relationships
  return { messages, relations }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bindMessages: (content) => dispatch(SetChatMessages(content)),
    bindNewMessagesCount: (content) => dispatch(SetNewMessagesCount(content))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ParentComponent))
