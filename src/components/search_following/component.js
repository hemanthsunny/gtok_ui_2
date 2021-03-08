import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import HeaderComponent from "./header";

import { SidebarComponent, SearchUserComponent, DisplaySearchUserComponent, PendingUserComponent } from "components";
import { SetAllUsers } from "store/actions";

const ParentComponent = ({
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
			let rlns = relations.filter(rln => rln["userIdOne"] === currentUser.id && rln["status"] === 1);
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

	const subHeader = () => (
		<div className="dashboard-tabs search-subheader" role="navigation" aria-label="Main">
			<div className="tabs -big">
				<Link to="/app/search" className="tab-item">Find a new search</Link>
				<Link to="/app/search/followers" className="tab-item">Your followers</Link>
				<Link to="/app/search/requests" className="tab-item">Pending requests</Link>
				<Link to="/app/search/following" className="tab-item -active">You following</Link>
			</div>
		</div>
  );

  return (
		<div>
			<HeaderComponent newAlertsCount={newAlertsCount} newMessagesCount={newMessagesCount} />
			<div>
				<SidebarComponent currentUser={currentUser} />
				<div className="dashboard-content">
					{subHeader()}
					<div className="container">
			    	<div className="d-flex">
							<div className="input-group my-3">
							  <input type="text" className="form-control br-0" aria-label="Search" placeholder="Search on names..." onChange={e => searchValue(e.target.value)}/>
							  <div className="input-group-append d-none">
							    <span className="input-group-text">
						      	<i className="fa fa-search" data-container="body" data-toggle="popover" data-placement="right" data-content="Try to speack 'search <YOUR_NAME>' For example - search Naga, search Prabha"></i> <br/>
							    </span>
							  </div>
							</div>
			    	</div>
						<small>{followingRelations.length} users</small>
						<div className="tab-content" id="pills-tabContent">
						  <div className="tab-pane fade" id="pills-requests" role="tabpanel" aria-labelledby="pills-requests-tab">
								{
									followingRelations[0] ? followingRelations.map((rln, idx) =>
										<DisplaySearchUserComponent displayUserId={rln.userIdTwo} currentUser={currentUser} status={rln.status} key={idx} />
									) : <div className="card text-center mt-2 p-2 text-secondary">No users found</div>
								}
						  </div>
						</div>
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
)(ParentComponent);
