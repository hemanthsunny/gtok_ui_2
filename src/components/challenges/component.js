import React from "react";
import { connect } from "react-redux";
import HeaderComponent from "./header";

function ChallengeComponent({ currentUser, newAlertsCount, newMessagesCount }) {
  return (
		<div>
			<HeaderComponent newAlertsCount={newAlertsCount} newMessagesCount={newMessagesCount} />
	    <div className="container challenges-wrapper">
        <div>
          <img src={require(`assets/svgs/RocketLaunch.svg`)} className="launch-icon" alt="Challenges" />
        </div><br/>
        <div className="launch-text">
          Still sit tight. And ready up to win prizes. <br/> Shortly we will be announcing challenges!
        </div>
	    </div>
		</div>
  );
};

const mapStateToProps = (state) => {
	const { newAlertsCount } = state.alerts;
	const { newMessagesCount } = state.chatMessages;
	return { newAlertsCount, newMessagesCount };
}

export default connect(
	mapStateToProps,
	null
)(ChallengeComponent);
