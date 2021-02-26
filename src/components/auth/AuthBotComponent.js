import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import { gtokBot } from "images";
import $ from "jquery";

import { signin, sendForgotPassword } from 'firebase_config';
import { SetReload } from "store/actions";
import { SetChatbotMessages } from "store/actions";

const AuthBotComponent = ({bindReload, messages, bindChatbotMessages}) => {
  const [ message, setMessage ] = useState("");
  const [ loginOption, setLoginOption ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const history = useHistory();

  useEffect(() => {
		var div = $(".chat-window");
		div.scrollTop(div.prop("scrollHeight"));
  }, [message, messages])

  const clickEventHandler = async (key, value) => {
  	let msg = {};
  	if (!message && !key) {
  		return null;
  	}
  	msg = {text: message.trim(), type: "answer"};
  	if (key === "loginOption") {
  		if (value === "Login" || value === "Forgot password") {
  			setLoginOption(value)
  			msg = {
  				text: "What is your email?"
  			}
  		}
  	}
  	await bindChatbotMessages([...messages, msg]);
  	await setMessage("");
  	await checkActions(msg);
  }

  const checkActions = async (msg) => {
  	let newMsg = [msg];
  	let tmpText = msg["text"].toLowerCase();
  	if (tmpText.includes("hello") || tmpText.includes("hi")) {
  		newMsg = [...newMsg, {
  			text: "You can click on one of these options",
  			options: ["Login", "Forgot password"]
  		}]
		}
  	if (tmpText.includes("thanks") || tmpText.includes("thank you")) {
  		newMsg = [...newMsg, {
  			text: "You're welcome"
  		}]
		} 

		if (loginOption === "Login") {
			if (!email && tmpText.includes("@")) {
	  		setEmail(tmpText);
	  		newMsg = [...newMsg, {
	  			text: "Now, enter your password."
	  		}, {
	  			text: "If your password is 1234, then enter gtok1234"
	  		}]
	  	} else if (!password && msg["text"].length >= 6 && msg["text"].includes("gtok")) {
	  		let pwd = msg["text"].replace("gtok", "");
	  		setPassword(pwd);
	  		newMsg = [...newMsg, {
	  			text: "Okay! Hold on a second. I'm verifiying your details..."
	  		}]
	  		handleForm(email, pwd, {text: "gtok"+pwd, type: "answer"});
	  	}
		}
		if (loginOption === "Forgot password") {
			if (!email && msg["text"].includes("@")) {
	  		setEmail(msg["text"]);
	  		let res = await sendForgotPassword(msg["text"]);
	  		console.log("res", res)
	  		if (res.status === 200) {
		  		newMsg = [...newMsg, {
		  			text: "I sent you a forgot password email. Check your emailbox to update password."
		  		}, {
		  			text: "Say 'hi' to login"
		  		}]
		  		setLoginOption("");
	  		} else {
		  		newMsg = [...newMsg, {
		  			text: res.message
		  		}]
	  		}
	  	} else if (msg["text"]) {
	  		newMsg = [];
	  	}
		}
		if (newMsg.length === 0) {
  		newMsg = [{
  			text: "Sorry, I didn't get you. Say 'hi' to start again.."
  		}]
  	}
  	setTimeout(() => {
	  	bindChatbotMessages([...messages, ...newMsg])
  	}, 200);  		
  }

  const handleForm = async (key, val, msg) => {
    let result = await signin({email: key, password: val});
    if (result.status !== 200) {
    	setEmail("");
    	setPassword("");
    	await bindChatbotMessages([...messages, msg, {text: result.message}, {
    		text: "Do you want to try again? Then say hi.."
    	}]);
    	return;
    }
  	await bindChatbotMessages([...messages, msg, {text: "Your details verified successfully. Hold on. Redirecting to your account..."}]);
  	setTimeout(() => {
	    bindReload(true);
	  	history.push("/app/home");
  	}, 1000);
  };

  return (
    <div className="mob-gtok-bot pt-5">
	    <div className="container mob-single-chat-window">
  			<div>
	    		<div className="chat-window-header media p-2">
	    			<img src={gtokBot} alt="user dp" className="chat-window-dp" />
	    			<div className="media-body">
	    				<div className="d-flex">
	    					<div className="flex-grow-1">
			    				<h6 className="pl-2 mb-0">
			    					Gtok Bot
			    				</h6>
			    				<small className="pl-2 font-13">
			    					Online
			    				</small>
	    					</div>
	    					<div className="flex-shrink-1 go-back-btn" title="Go back">
	    						<Link to="/login">
	    							<i className="fa fa-arrow-left"></i>
	    						</Link>
	    					</div>
	    				</div>
		    		</div>
	    		</div>
			  	<div className="chat-window pt-2 pr-2">
			  		{messages.map((msg, i) => (
			  			<div key={i}>
					  		<div className={`p-2 my-2 white-space-preline ${msg.type !== "answer" ? "sender ml-2" : "receiver my-3"}`}>
					  			{msg.text}
					  		</div>
					  		<div>
					  			{(msg.options && msg.options[0]) && (
					  				<div className="d-flex flex-row options">
					  					{
					  						msg.options.map((opt, idx) => (
					  							<div key={idx} onClick={e => clickEventHandler("loginOption", opt)} className="optValue sender ml-1 p-2">{opt}</div>
					  						))
					  					}
					  				</div>
					  			)}
					  		</div>
					  	</div>
			  		))}
			  	</div>
		      <div className="d-flex px-3 align-self-center align-items-center bot-chat-window-footer">
		    		<div className="flex-grow-1">
			      	<textarea className="reply-box" rows="1" placeholder="Write message here.." onChange={e => setMessage(e.target.value)} value={message}>
			      	</textarea>
			      </div>
		      	<div className="flex-shrink-1 pl-2" onClick={e => clickEventHandler()}>
			      	<i className="fa fa-paper-plane reply-box-icon"></i>
			      </div>
		      </div>
  			</div>
	    </div>
    </div>
  );
};

const mapStateToProps = (state) => {
	const { messages } = state.chatbotMessages;
	return { messages };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindReload: (content) => dispatch(SetReload(content)),
		bindChatbotMessages: (content) => dispatch(SetChatbotMessages(content))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AuthBotComponent);