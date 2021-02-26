import React from "react";
import HeaderComponent from "./header";

function PurchaseBadgesComponent({ currentUser }) {
  return (
		<div>
			<HeaderComponent />
	    <div className="container purchase-wrapper">
        <div>
          <img src={require(`assets/svgs/PurchaseBadges.svg`)} className="launch-icon" alt="Challenges" />
        </div><br/>
        <div className="launch-text">
          To enjoy exclusive features, buy badges. During this season, limited badges are available. We give the basis of First Come First Serve.
        </div>
      </div>
		</div>
  );
};

export default PurchaseBadgesComponent;
