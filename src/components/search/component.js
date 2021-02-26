import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import HeaderComponent from "./header";

import { SearchUserComponent, DisplaySearchUserComponent, PendingUserComponent } from "components";
import { SetAllUsers } from "store/actions";

const SearchComponent = ({
	currentUser, allUsers, bindAllUsers, relations, newAlertsCount, newMessagesCount
}) => {
	const [ searchVal, setSearchVal ] = useState("");
	const [ voiceIcon, setVoiceIcon ] = useState("microphone");
	const [ microphoneText, setMicrophoneText ] = useState("");
	const [ pendingRelations, setPendingRelations ] = useState([]);
	const [ followerRelations, setFollowerRelations ] = useState([]);
	const [ followingRelations, setFollowingRelations ] = useState([]);

  useEffect(() => {
		window.jQuery('[data-toggle="popover"]').popover();
  	if (!allUsers[0] && !searchVal) {
			if (currentUser.admin) bindAllUsers(currentUser, "adminUsers");
			else bindAllUsers(currentUser, "all");
  	}
  	if (relations[0]) {
  		let rlns = relations.filter(rln => rln["userIdTwo"] === currentUser.id && rln["status"] === 0);
  		setPendingRelations(rlns);
  		rlns = relations.filter(rln => rln["userIdTwo"] === currentUser.id && rln["status"] === 1);
  		setFollowerRelations(rlns);
  		rlns = relations.filter(rln => rln["userIdOne"] === currentUser.id && rln["status"] === 1);
  		setFollowingRelations(rlns);
  	}
  }, [currentUser, allUsers, bindAllUsers, searchVal, relations]);

	const searchValue = async (val) => {
		if (val.includes("search")) {
			val = val.replace("search", "").trim().toLowerCase();
		}
		if (!!val) {
			val = val.trim().toLowerCase();
		}
		if (val.includes("clear search") ||
			val.includes("clear all") ||
			val.includes("show all") ||
			val.includes("show me all")
		) {
			val = "";
		}
		await bindAllUsers(currentUser, "search", val);
		setSearchVal(val);
		if (!!val && !allUsers[0]) {
			// readoutLoud("No search results found");
		}
	}

	const initiateSpeech = async (actionType="") => {
		try {
			var SpeechRecognition = window.SpeechRecogntion || window.webkitSpeechRecognition;
			var recognition = new SpeechRecognition();
		}
		catch(e) {
			console.log("e", e, microphoneText);
		}

		recognition.continuous = true;
		recognition.onresult = function(event) {
		  var current = event.resultIndex;
		  var transcript = event.results[current][0].transcript;

		  var mobileRepeatBug = (current === 1 && transcript === event.results[0][0].transcript);

		  if(!mobileRepeatBug) {
		    // noteContent += transcript;
		    // noteTextarea.val(noteContent);
		    setMicrophoneText(transcript);
		    searchValue(transcript);
		  }
			setVoiceIcon("pause");
		};

		recognition.onstart = function() {
			setMicrophoneText("Voice recognition activated. Try speaking into microphone");
			setVoiceIcon("pause");
		}

		recognition.onend = function() {
			setMicrophoneText("Voice recognition stopped.");
			setVoiceIcon("microphone");
		}

		recognition.onspeechend = function() {
			setMicrophoneText("You were quiet for a while so voice recognition turned itself off.");
			setVoiceIcon("microphone");
		}

		recognition.onerror = function(e) {
			if (e.error === "no-speech") {
				setMicrophoneText("No speech was detected. Try again.");
				setVoiceIcon("microphone");
			}
		}

		recognition.onnomatch = function(e) {
			setMicrophoneText("No match found");
		}

		if (actionType === "start") {
			recognition.start();
		}
		if (actionType === "stop") {
			recognition.stop();
			setVoiceIcon("microphone");
		}
	}

/*
	const readoutLoud = (text) => {
		var speech = new SpeechSynthesisUtterance();

	  // Set the text and voice attributes.
		speech.text = text ? text : (microphoneText ? microphoneText : "Nothing to search");
		speech.volume = 1;
		speech.rate = 1;
		speech.pitch = 1;

		window.speechSynthesis.speak(speech);
		setMicrophoneText(speech.text);
	}
*/
  return (
		<div>
			<HeaderComponent newAlertsCount={newAlertsCount} newMessagesCount={newMessagesCount} />
	    <div className="container">
	    	<div className="d-flex">
					<div className="input-group my-3">
					  <input type="text" className="form-control br-0" aria-label="Search" placeholder="Search on names..." onChange={e => searchValue(e.target.value)}/>
					  <div className="input-group-append d-none">
					  	{
					  		voiceIcon !== "microphone" ?
						    <span className="input-group-text" onClick={e =>initiateSpeech("stop")}>
						    	<i className="fa fa-pause-circle-o"></i>
						    </span> :
						    <span className="input-group-text" onClick={e =>initiateSpeech("start")}>
						    	<i className="fa fa-microphone"></i>
						    </span>
					  	}
					  {/*
					    <span className="input-group-text" onClick={e => readoutLoud()}>
					    	<i className="fa fa-volume-control-phone"></i>
					    </span>
					  */}
					    <span className="input-group-text">
				      	<i className="fa fa-search" data-container="body" data-toggle="popover" data-placement="right" data-content="Try to speack 'search <YOUR_NAME>' For example - search Naga, search Prabha"></i> <br/>
					    </span>
					  </div>
					</div>
	    	</div>
				<ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
				  <li className="nav-item p-0 mx-0">
				    <a className="nav-link p-0 active" id="pills-all-tab" data-toggle="pill" href="#pills-all" role="tab" aria-controls="pills-all" aria-selected="true">All</a>
				  </li>
				  <li className="nav-item p-0">
				    <a className="nav-link p-0" id="pills-requests-tab" data-toggle="pill" href="#pills-requests" role="tab" aria-controls="pills-requests" aria-selected="false">Pending ({pendingRelations.length})</a>
				  </li>
				  <li className="nav-item p-0 mx-0">
				    <a className="nav-link p-0" id="pills-followers-tab" data-toggle="pill" href="#pills-followers" role="tab" aria-controls="pills-followers" aria-selected="false">Followers ({followerRelations.length})</a>
				  </li>
				  <li className="nav-item p-0">
				    <a className="nav-link p-0" id="pills-following-tab" data-toggle="pill" href="#pills-following" role="tab" aria-controls="pills-following" aria-selected="false">Following ({followingRelations.length})</a>
				  </li>
				</ul>
				<div className="tab-content" id="pills-tabContent">
				  <div className="tab-pane fade show active" id="pills-all" role="tabpanel" aria-labelledby="pills-all-tab">
			    	{
			    		allUsers[0] ? allUsers.map((user, idx) =>
			  				<SearchUserComponent displayUser={user} currentUser={currentUser} key={idx} />
			  			) : <div className="card text-center mt-2 p-2 text-secondary">No users found</div>
			    	}
				  </div>
				  <div className="tab-pane fade" id="pills-requests" role="tabpanel" aria-labelledby="pills-requests-tab">
			    	{
			    		pendingRelations[0] ? pendingRelations.map((rln, idx) =>
			  				<PendingUserComponent displayUserId={rln.userIdOne} currentUser={currentUser} status={rln.status} key={idx} />
			  			) : <div className="card text-center mt-2 p-2 text-secondary">No users found</div>
			    	}
				  </div>
				  <div className="tab-pane fade" id="pills-followers" role="tabpanel" aria-labelledby="pills-followers-tab">
			    	{
			    		followerRelations[0] ? followerRelations.map((rln, idx) =>
			  				<DisplaySearchUserComponent displayUserId={rln.userIdOne} currentUser={currentUser} status={rln.status} key={idx} />
			  			) : <div className="card text-center mt-2 p-2 text-secondary">No users found</div>
			    	}
				  </div>
				  <div className="tab-pane fade" id="pills-following" role="tabpanel" aria-labelledby="pills-following-tab">
			    	{
			    		followingRelations[0] ? followingRelations.map((rln, idx) =>
			  				<DisplaySearchUserComponent displayUserId={rln.userIdTwo} currentUser={currentUser} status={rln.status} key={idx} />
			  			) : <div className="card text-center mt-2 p-2 text-secondary">No users found</div>
			    	}
				  </div>
				</div>
	    </div>
		</div>
  );
};

const mapStateToProps = (state) => {
	const { allUsers } = state.users;
	const { relations } = state.relationships;
	const { newAlertsCount } = state.alerts;
	const { newMessagesCount } = state.chatMessages;
	return { allUsers, relations, newAlertsCount, newMessagesCount };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindAllUsers: (content, type, searchVal) => dispatch(SetAllUsers(content, type, searchVal))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchComponent);
