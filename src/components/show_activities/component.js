import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import HeaderComponent from "./header";
import ActivityComponent from "./children/activity/component";

import {
	SidebarComponent,
	LoadingComponent
} from "components";
import { SetPosts } from "store/actions";
import { getQuery, firestore, remove } from "firebase_config";

class ParentComponent extends Component {
	constructor(props) {
		super(props);
		this.propsState = props.history.location.state || {};
		this.state = {
			activities: props.activities || []
		}
	}

	componentDidMount() {
		this.loadActivities();
	}

	loadActivities = async () => {
		this.setState({loading: true});
		let activities = await getQuery(
			firestore.collection("activities").orderBy("createdAt", "desc").get()
		);
		activities = activities.sort((a,b) => b.createdAt - a.createdAt);
		this.setState({
			pageId: 2,
			activities,
			loading: false
		})
		// await this.bindPosts(this.props.currentUser, "none", posts);
	}

	subHeader = () => (
		<div className="dashboard-tabs" role="navigation" aria-label="Main">
			<div className="tabs -big">
				<Link to="/app/posts" className="tab-item">Feelings</Link>
				<Link to="/app/activities" className="tab-item -active">Activities</Link>
			</div>
		</div>
  );

	render() {
		return (
			<div style={{background: "rgba(0, 0, 0, 0.01)"}}>
				<HeaderComponent newAlertsCount={this.props.newAlertsCount} newMessagesCount={this.props.newMessagesCount} />
				<div>
					<SidebarComponent currentUser={this.props.currentUser} />
					<div className="dashboard-content">
						{this.subHeader()}
						<div className="activity-wrapper">
							{this.state.activities.map((activity, idx) => (
								<ActivityComponent activity={activity} currentUser={this.props.currentUser} key={idx} />
							))}
						</div>
			    	{this.state.loading && <LoadingComponent />}
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	const { newAlertsCount } = state.alerts;
	const { newMessagesCount } = state.chatMessages;
	return { newAlertsCount, newMessagesCount };
}

export default connect(
	mapStateToProps,
	null
)(withRouter(ParentComponent));
