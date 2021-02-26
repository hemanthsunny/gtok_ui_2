import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import HeaderComponent from "./header";

import {
	LoadingComponent
} from "components";
import { SetPosts } from "store/actions";
import { getQuery, firestore, remove } from "firebase_config";

class ActivitiesComponent extends Component {
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

	deleteActivity = async (post) => {
		if (post.id && window.confirm("Are you sure to delete this post?")) {
			let result = await remove("activities", post.id);
  		/* Log the activity */
	  	// await add("logs", {
	  	// 	text: `${currentUser.displayName} removed the post`,
	  	// 	photoURL: currentUser.photoURL,
	  	// 	receiverId: "",
	  	// 	userId: currentUser.id,
	  	// 	actionType: "delete",
	  	// 	collection: "posts",
	  	// 	actionId: displayPost.id,
	  	// 	actionKey: "id",
			// 	actionLink: "/app/profile/"+currentUser.id,
	  	// 	timestamp
	  	// });
			this.setState(result);
		}
		await this.loadActivities();
	}

  subHeader = () => (
		<div className="d-flex flex-row justify-content-around activity-sub-header">
			<div>
				<Link to="/app/posts" className="">Feeling</Link>
			</div>
			<div>
				<Link to="/app/activities" className="">Activity</Link>
			</div>
		</div>
  );

	render() {
		return (
			<div style={{background: "rgba(0, 0, 0, 0.01)"}}>
				<HeaderComponent newAlertsCount={this.props.newAlertsCount} newMessagesCount={this.props.newMessagesCount} />
        {this.subHeader()}
		    <div className="container">
					<div className="activities-wrapper">
						{this.state.activities.map((activity, idx) => (
							<div className="activity-card" key={idx}>
								<div className="media">
									<div className="activity-time">
										{moment(activity.createdAt).format("HH:mm")}<br/>
										{moment(activity.createdAt).format("DD/MM/YY")}
									</div>
									<div className="media-body">
										<div className="activity-text">
											{activity.text}
											<img src={require(`assets/svgs/Trash.svg`)} className={`trash-icon pointer pull-right ${activity.userId !== this.props.currentUser.id && "d-none"}`} alt="Remove" onClick={e => this.deleteActivity(activity)} />
										</div>
										<p className="activity-description">{activity.description}</p>
									</div>
								</div>
								<hr className="activity-divider"/>
							</div>
						))}
					</div>
		    	{this.state.loading && <LoadingComponent />}
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	const { posts } = state.posts;
	const { newAlertsCount } = state.alerts;
	const { newMessagesCount } = state.chatMessages;
	return { posts, newAlertsCount, newMessagesCount };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindPosts: (currentUser, type, ops) => dispatch(SetPosts(currentUser, type, ops))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(ActivitiesComponent));
