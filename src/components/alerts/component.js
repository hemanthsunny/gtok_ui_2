import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import moment from "moment";
import HeaderComponent from "./header";

import { gtokFavicon } from "images";
import { capitalizeFirstLetter } from "helpers";
import { SidebarComponent, LoadingComponent, AlertHeaderComponent } from "components";
import { SetAlerts, CreatePageVisits } from "store/actions";

const ParentComponent = ({
	currentUser, alerts, bindAlerts, createPageVisits, newAlertsCount, newMessagesCount
}) => {
	const [ loading, setLoading ] = useState(false);

	useEffect(() => {
		if (!alerts[0] || newAlertsCount>0) bindAlerts(currentUser, "all");
		setLoading(false);
		setTimeout(() => {
			createPageVisits(currentUser);
		}, 2000);
	}, [bindAlerts, currentUser, alerts, createPageVisits, newAlertsCount]);

	const setDefaultImg = (e) => {
		e.target.src = gtokFavicon;
	}

  const subHeader = () => (
		<div className="dashboard-tabs" role="navigation" aria-label="Main">
			<div className="tabs -big">
				<Link to="/app/chats" className="tab-item">
					Chats {newMessagesCount>0 && <sup><img src={require(`assets/svgs/DotActive.svg`).default} className={`dot-icon`} alt="Dot" /></sup>}
				</Link>
				<Link to="/app/alerts" className="tab-item -active">
					Alerts {newAlertsCount>0 && <sup><img src={require(`assets/svgs/DotActive.svg`).default} className={`dot-icon`} alt="Dot" /></sup>}
				</Link>
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
					<div className="container mt-4">
	  	    	<div className="card alerts-wrapper">
	  	    		{
	  	    			loading ? <LoadingComponent /> : (
	  		    			alerts[0] ? alerts.map(alert => (
	  						  	<Link to={alert.actionLink || "/app/profile/"+alert.userId} key={alert.id}>
	  									<div className="media p-3" style={{boxShadow: "1px 1px 2px gainsboro"}}>
	  								  	<img className="mr-2" src={alert.photoURL || gtokFavicon} alt="Card img cap" onError={setDefaultImg} style={{width: "37px", height: "37px", objectFit: "cover", borderRadius: "50%"}} />
	  									  <div className="media-body font-xs-small">
	  									  	{capitalizeFirstLetter(alert.text)}<br/>
	  									  	<small className="pull-right text-secondary">
	  									  		{moment(alert.createdAt).fromNow()}
	  									  	</small>
	  									  </div>
	  								  <hr/>
	  							  </div>
	  						  	</Link>
	  		    			)) : <div className="text-secondary text-center p-2">No alerts to show</div>
	  	    			)
	  	    		}
	  	    	</div>
	  	    </div>
        </div>
      </div>
		</div>
  );
};

const mapStateToProps = (state) => {
	const { alerts, newAlertsCount } = state.alerts;
	const { newMessagesCount } = state.chatMessages;
	return { alerts, newAlertsCount, newMessagesCount };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindAlerts: (content, type) => dispatch(SetAlerts(content, type)),
		createPageVisits: (content, type) => dispatch(CreatePageVisits(content))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ParentComponent);
