import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";

import { Metadata } from "constants/index";
import { SetNewMessagesCount, SetNewAlertsCount, SetSurveysList, SetRelationships, SetPurchaseOrders, SetPrices, SetWallet } from "store/actions";
import { HelmetMetaDataComponent } from "components";

const BottomHeaderComponent = ({
	currentUser,
	newMessagesCount,
	bindNewMessagesCount,
	newAlertsCount,
	bindNewAlertsCount,
	bindSurveysList,
	bindRelationships,
	bindPurchaseOrders,
	bindWallet,
	bindPrices
}) => {
	const [metaDetails, setMetaDetails] = useState({});
  // Window handlers
	window.jQuery('[data-toggle="popover"]').popover();

	useEffect(() => {
		let path = window.location.pathname;
		if (path.includes("/app/chats")) {
			setMetaDetails(Metadata["/app/chats"])
		} else if (path.includes("/app/similarities")) {
			setMetaDetails(Metadata["/app/similarities"])
		} else if (path.includes("/app/profile")) {
			setMetaDetails(Metadata["/app/profile"])
		} else if (path.includes("/app/create_post")) {
			setMetaDetails(Metadata["/app/create_post"])
		} else {
			setMetaDetails(Metadata[path || "default"]);
		}
		bindNewMessagesCount(currentUser);
		bindNewAlertsCount(currentUser);
		// bindSurveysList(currentUser);
  	bindRelationships(currentUser);
		bindPurchaseOrders(currentUser);
		bindWallet(currentUser);
		bindPrices(currentUser);
	}, [metaDetails, bindNewMessagesCount, bindNewAlertsCount, bindSurveysList, currentUser, bindRelationships, bindPurchaseOrders, bindPrices, bindWallet]);

  return (
    <div>
    	{
    		metaDetails && metaDetails.title &&
    		<HelmetMetaDataComponent title={metaDetails.title} keywords={metaDetails.keywords} description={metaDetails.description}/>
    	}
    	<div className="d-flex flex-row navbar-bottom align-items-center align-self-center justify-content-around">
				<div className="nav-item ml-1" title="Home">
					<div className="nav-link text-center">
						<Link to="/app/posts">
							<img src={(metaDetails && (metaDetails.path === "posts" || metaDetails.path === "activities")) ? require(`assets/svgs/HomeActive.svg`).default : require(`assets/svgs/Home.svg`).default} className="home-icon" alt="Home" />
						</Link>
					</div>
				</div>
				<div className="nav-item ml-1" title="Create post">
					<div className="nav-link text-center">
						<Link to="/app/create_post">
							<img src={(metaDetails && (metaDetails.path === "create_post" || metaDetails.path === "create_activity")) ? require(`assets/svgs/PlusActive.svg`).default : require(`assets/svgs/Plus.svg`).default} className="plus-c-icon" alt="Create post" />
						</Link>
					</div>
				</div>
				<div className="nav-item ml-1" title="Profile">
					<div className="nav-link text-center">
						<Link to="/app/profile">
							<img src={(metaDetails && metaDetails.path === "profile") ? require(`assets/svgs/ProfileActive.svg`).default : require(`assets/svgs/Profile.svg`).default} className="profile-icon" alt="Profile" />
						</Link>
					</div>
				</div>
    	</div>
    </div>
  );
};

const mapStateToProps = (state) => {
	const { newMessagesCount } = state.chatMessages;
	const { newAlertsCount } = state.alerts;
	return { newMessagesCount, newAlertsCount };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindNewMessagesCount: (content) => dispatch(SetNewMessagesCount(content)),
		bindNewAlertsCount: (content) => dispatch(SetNewAlertsCount(content)),
		bindSurveysList: (content) => dispatch(SetSurveysList(content)),
		bindRelationships: (content) => dispatch(SetRelationships(content)),
		bindPurchaseOrders: (content) => dispatch(SetPurchaseOrders(content)),
		bindWallet: (content) => dispatch(SetWallet(content)),
		bindPrices: (content) => dispatch(SetPrices(content))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BottomHeaderComponent);
