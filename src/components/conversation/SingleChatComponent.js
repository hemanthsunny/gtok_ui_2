import React, { Component } from "react";
import { add, getQuery, update, firestore, timestamp } from "firebase_config";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";

import { capitalizeFirstLetter } from "helpers";
import { LoadingComponent } from "components";
import { SetChatMessages, SetNewMessagesCount } from "store/actions";
import { gtokFavicon } from "images";

class SingleChatComponent extends Component {	
	constructor(props) {
		super(props);
		this.state = {
			message: "",
			messagesList: [],
			conversation: props.conversation,
			currentUser: props.currentUser,
			chatUser: props.conversation.usersRef.find(u => u.id !== props.currentUser.id)
		}
		this.defaultImage = "../../logo192.png"; 
		this.unsubscribe = "";
		// this.messagesList = [];
		this.bindMessages = props.bindMessages;
		this.bindNewMessagesCount = props.bindNewMessagesCount;
	}

	componentDidMount() {
		this.getMessagesSnapshot();
		this.scrollToBottom();
		// this.scrollToBottom({behavior: "smooth"});
	}

	componentDidUpdate() {
		this.scrollToBottom();
	}

	componentWillReceiveProps(newProps) {
		if (newProps.conversation.id !== this.props.conversation.id) {
			this.getInitialMessages(newProps.conversation);
			this.scrollToBottom();
		}
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	getInitialMessages = async (conversation) => {
		this.setState({loading: true});
		let result = await getQuery(
			firestore.collection("messages").where("conversationId", "==", conversation.id).orderBy("timestamp").get()
		);
		this.setState({
			conversation,
			messagesList: result,
			chatUser: conversation.usersRef.find(u => u.id !== this.state.currentUser.id),
			loading: false
		});
		await this.updateConvo();
	}

	scrollToBottom = () => {
		this.el.scrollIntoView();
	}

	updateConvo = async (data = {}) => {
		// Simplify these lines of code in future
		let chatUserRefs = this.state.conversation.usersRef;
		chatUserRefs = chatUserRefs.map((user) => {
			if (user.id === this.state.currentUser.id) {
				user["lastSeen"] = new Date();
				user["displayName"] = this.state.currentUser.displayName;
				user["photoURL"] = this.state.currentUser.photoURL;
				user["unread"] = false;
			} else {
				if (data["newMessage"]) {
					user["unread"] = true;
					delete data["newMessage"];
				}
			}
			return user;
		});
		// let currentChatUser = chatUserRefs.find(u => u.id === this.state.currentUser.id);
		// let idx = chatUserRefs.findIndex(u => u.id === this.state.currentUser.id);
		// currentChatUser["lastSeen"] = timestamp;
		// currentChatUser["displayName"] = this.state.currentUser.displayName;
		// currentChatUser["photoURL"] = this.state.currentUser.photoURL;
		// chatUserRefs[idx] = currentChatUser;

		await update("conversations", this.state.conversation.id, Object.assign(
			this.state.conversation,
			data,
			{
				usersRef: chatUserRefs
			}
		));
		this.bindNewMessagesCount(this.state.currentUser);
	}

	getMessagesSnapshot = async () => {
		let messagesList = []
		this.setState({loading: true, messagesList: []});
		this.unsubscribe = await firestore.collection("messages")
			.where("conversationId", "==", this.state.conversation.id)
			.orderBy("timestamp")
			.onSnapshot(async (snapshot) => {
				snapshot.docChanges().forEach(async (change) => {
					if (change.type === "added") {
						let msg = change.doc.data();
						msg["id"] = change.doc.id;
						messagesList.push(msg);
					}
				})
				messagesList = _.uniqBy(messagesList, "id");
				this.setState({
					loading: false,
					messagesList: messagesList
				});
				await this.updateConvo();
				// this.bindMessages(this.messagesList.sort((a,b) => a.createdAt - b.createdAt));
			})
		return this.unsubscribe;
	}

  handleKeyPress = (e) => {
  	if (e.key === "Enter" && e.key === "Shift") {
  		e.default();
  	} else if (e.key === "Enter") {
  		this.sendMessage();
  	}
  }

  sendMessage = async () => {
  	if (!this.state.message.trim()) { return; }
  	let data = {
  		conversationId: this.state.conversation.id,
  		text: this.state.message.trim(),
  		users: this.state.conversation.users,
  		admin: this.state.currentUser.id,
  		timestamp
  	}
  	await add("messages", data);
  	await this.updateConvo({
  		lastMessage: this.state.message,
  		lastMessageTime: timestamp,
  		newMessage: true
  	});
  	this.setState({
  		message: "",
  		messagesList: [...this.state.messagesList, data]
  	});
  }

  isMsgAdmin = (adminId) => {
  	return adminId !== this.state.currentUser.id;
  }

  render() {
	  return (
	    <div className="container p-2">
    		<div className="chat-window-header media p-2">
    			<img src={this.state.conversation.photoURL || this.state.chatUser.photoURL || gtokFavicon} alt="user dp" className="chat-window-dp" />
    			<div className="media-body">
    				<h6 className="p-0 mb-0 pl-2">
    				{this.state.conversation.groupName || capitalizeFirstLetter(this.state.chatUser.displayName)}
    				</h6>
    				<small className="p-0 pl-2">
    				Last updated {moment(this.state.conversation.updatedAt).format("HH:mm DD/MM/YY")}
    				</small>
	    		</div>
    		</div>
	    	<div className="chat-window pt-2 pr-2">
		    	{
		    		this.state.loading ? <LoadingComponent /> : 
		    		this.state.messagesList[0] ? 
		    			this.state.messagesList.map((msg, idx) => (
			    			<div key={idx}>
				    			<p className={`${this.isMsgAdmin(msg.admin) ? "sender" : "receiver"} p-2`}>
				    				<small className="pull-right">{moment(msg.createdAt).format("HH:mm DD/MM/YY")}</small> <br/>
				    			{msg.text}
				    			</p>
				    		</div>
							))
						: <div className="text-center text-secondary"> No messages yet </div>
		    	}
	    		<div ref={el => {this.el = el;}}></div>
	    	</div>
	      <div className="d-flex flex-row">
	    		<div className="col-11">
		      	<textarea className="reply-box" rows="1" placeholder="Write message here.." value={this.state.message} onChange={e => this.setState({message: e.target.value})} onKeyPress={e => this.handleKeyPress(e)}>
		      	</textarea>
		      </div>
	      	<div className="col-1">
		      	<i className="fa fa-paper-plane reply-box-icon" onClick={e => this.sendMessage()}></i>
		      </div>
	      </div>
	    </div>
	  );
  }
};

const mapStateToProps = (state) => {
	const { messages } = state.chatMessages;
	return { messages }
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindMessages: (content) => dispatch(SetChatMessages(content)),
		bindNewMessagesCount: (content) => dispatch(SetNewMessagesCount(content)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SingleChatComponent);