import React from "react";
import HeaderComponent from "./header";

function RedeemBadgesComponent({ currentUser }) {
  return (
		<div>
			<HeaderComponent />
	    <div className="container redeem-wrapper">
        <div>
          <img src={require(`assets/svgs/Money.svg`)} className="launch-icon" alt="Challenges" />
        </div><br/>
        <div className="launch-text">
          Earn and exchange badges with cash. You've got 0 badges.
        </div>
	    </div>
		</div>
  );
};

export default RedeemBadgesComponent;
