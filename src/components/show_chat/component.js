import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";
import "./style.css";

import HeaderComponent from "./header";
import { LoadingComponent, CustomImageComponent } from "components";
import { SetChatMessages, SetNewMessagesCount } from "store/actions";
import { gtokFavicon } from "images";
import { add, getId, update, firestore, timestamp } from "firebase_config";
import { convertTextToLink } from "helpers";

class ParentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: localStorage.getItem("sharePostText") || "",
      messagesList: [],
      convoId: props.match.params.id,
      currentUser: props.currentUser,
      copied: false,
      autoFocus: false,
    };
    this.unsubscribe = "";
    // this.messagesList = [];
    this.bindMessages = props.bindMessages;
    this.bindNewMessagesCount = props.bindNewMessagesCount;
    this.scrollRef = React.createRef();
  }

  componentDidMount() {
    /* Clear localStorage */
    localStorage.removeItem("sharePostText");
    this.getSelectedConversation();
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  getSelectedConversation = async (id) => {
    if (!id) {
      id = this.state.convoId;
    }
    const result = await getId("conversations", id);
    result.id = id;
    const chatUser = result.usersRef.find(
      (u) => u.id !== this.state.currentUser.id
    );
    this.setState({
      convoId: id,
      conversation: result,
      chatUser: await getId("users", chatUser.id),
      chatUserLastSeen: chatUser.lastSeen.seconds,
    });
    this.getMessagesSnapshot();
  };

  scrollToBottom = (e) => {
    setTimeout(() => {
      // this.scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Alternative option: https://stackoverflow.com/questions/43441856/how-to-scroll-to-an-element
      window.scrollTo(0, this.scrollRef.current?.offsetTop);
    }, 1000);
  };

  updateConvo = async (data = {}) => {
    // Simplify these lines of code in future
    let chatUserRefs = this.state.conversation.usersRef;
    chatUserRefs = chatUserRefs.map((user) => {
      if (user.id === this.state.currentUser.id) {
        user.lastSeen = new Date();
        user.displayName = this.state.currentUser.displayName;
        user.photoURL = this.state.currentUser.photoURL;
        user.unread = false;
      } else {
        if (data.newMessage) {
          user.unread = true;
          delete data.newMessage;
        }
      }
      return user;
    });
    await update(
      "conversations",
      this.state.conversation.id,
      Object.assign(this.state.conversation, data, {
        usersRef: chatUserRefs,
      })
    );
    this.bindNewMessagesCount(this.state.currentUser);
  };

  getMessagesSnapshot = async () => {
    let messagesList = [];
    this.setState({ loading: true, messagesList: [] });
    this.unsubscribe = await firestore
      .collection("messages")
      .where("conversationId", "==", this.state.convoId)
      .orderBy("timestamp")
      .onSnapshot(async (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const msg = change.doc.data();
            msg.id = change.doc.id;
            messagesList.push(msg);
          }
        });
        messagesList = _.uniqBy(messagesList, "id");
        this.setState({
          loading: false,
          messagesList,
        });
        await this.updateConvo();
        // this.bindMessages(this.messagesList.sort((a,b) => a.createdAt - b.createdAt));
      });
    return this.unsubscribe;
  };

  handleKeyPress = (e) => {
    // if (e.key === 'Enter' && e.key === 'Shift') {
    //   e.default();
    // } else if (e.key === 'Enter') {
    //   this.sendMessage();
    // }
  };

  sendMessage = async () => {
    if (!this.state.message.trim()) {
      return;
    }
    const data = {
      conversationId: this.state.conversation.id,
      text: this.state.message.trim(),
      users: this.state.conversation.users,
      admin: this.state.currentUser.id,
      timestamp,
    };
    await add("messages", data);
    await this.updateConvo({
      lastMessage: this.state.message,
      lastMessageTime: timestamp,
      newMessage: true,
    });
    this.setState({
      message: "",
      autoFocus: true,
    });
  };

  isMsgAdmin = (adminId) => {
    return adminId !== this.state.currentUser.id;
  };

  copyText = (text) => {
    navigator.clipboard.writeText(text);
    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 1500);
  };

  shareText = (text) => {
    this.props.history.push({
      pathname: "/app/create_asset",
      state: { sharePostText: text },
    });
  };

  copiedTextAlert = () => <div className="page-top-alert"> Copied </div>;

  renderMessageWindow = () => (
    <div className="chat-window">
      {this.state.loading ? (
        <LoadingComponent />
      ) : this.state.messagesList[0] ? (
        this.state.messagesList.map((msg, idx) => (
          <div className="chat-messages" key={idx}>
            <div
              className={`${
                this.isMsgAdmin(msg.admin)
                  ? "sender ml-2 mt-1 mb-2"
                  : "receiver mt-1"
              } white-space-preline`}
            >
              {convertTextToLink(msg.text)}
              <div className="msg-header">
                <small className="pull-right msg-datetime">
                  {moment(msg.createdAt).format("HH:mm")}
                </small>
                <div className="dropdown p-0 pull-right d-none">
                  <i
                    className="fa fa-angle-down msg-menu-icon"
                    data-toggle="dropdown"
                  ></i>
                  <div className="dropdown-menu">
                    <button
                      className="dropdown-item btn-link"
                      onClick={(e) => this.copyText(msg.text)}
                    >
                      <i className="fa fa-copy"></i>&nbsp; Copy text
                    </button>
                    <button
                      className="dropdown-item btn-link"
                      onClick={(e) => this.shareText(msg.text)}
                    >
                      <i className="fa fa-share"></i> &nbsp; Share via Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-secondary"> No messages yet </div>
      )}
      <div ref={this.scrollRef}></div>
    </div>
  );

  setDefaultImg = (e) => {
    e.target.src = gtokFavicon;
  };

  subHeader = () => (
    <div className="chat-subheader" aria-label="Subheader">
      <Link to="/app/chats">
        <img
          src={require("assets/svgs/LeftArrow.svg").default}
          className="go-back-icon"
          alt="LeftArrow"
        />
      </Link>
      <div className="page-name">
        {this.state.conversation && this.state.chatUser ? (
          <div className="media">
            <CustomImageComponent user={this.state.chatUser} size="sm" />
            <div className="media-body pl-2">
              @{this.state.chatUser.username}
            </div>
          </div>
        ) : (
          <LoadingComponent />
        )}
      </div>
    </div>
  );

  render() {
    return (
      <div>
        <HeaderComponent />
        <div className="dashboard-content -opts">
          {this.subHeader()}
          <div className="mob-single-chat-window">
            {this.state.copied && this.copiedTextAlert()}
            {this.state.conversation && this.state.chatUser ? (
              <div>
                {this.renderMessageWindow()}
                <div className="chat-window-footer">
                  <div className="input-group mb-sm-3">
                    <textarea
                      className="form-control"
                      placeholder="Type message"
                      aria-label="Type message"
                      aria-describedby="reply-message"
                      onChange={(e) =>
                        this.setState({ message: e.target.value })
                      }
                      onKeyPress={(e) => this.handleKeyPress(e)}
                      autoFocus={this.state.autoFocus}
                      value={this.state.message}
                    ></textarea>
                    <div className="input-group-append">
                      <img
                        className=""
                        src={require("assets/svgs/ArrowUp.svg").default}
                        alt="1"
                        onClick={(e) => this.sendMessage()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <LoadingComponent />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { messages } = state.chatMessages;
  const { relations } = state.relationships;
  const { sharePost } = state.posts;
  return { messages, relations, sharePost };
};

const mapDispatchToProps = (dispatch) => {
  return {
    bindMessages: (content) => dispatch(SetChatMessages(content)),
    bindNewMessagesCount: (content) => dispatch(SetNewMessagesCount(content)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ParentComponent));
