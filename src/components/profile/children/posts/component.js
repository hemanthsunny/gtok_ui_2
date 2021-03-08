import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import PostComponent from "components/show_posts/children/post/component";
import {
	LoadingComponent
} from "components";
import { SetPosts } from "store/actions";
import { capitalizeFirstLetter } from "helpers";
import { gtokFavicon, gtokBot } from "images";
import { getQuery, firestore } from "firebase_config";

class PostsComponent extends Component {
	constructor(props) {
		super(props);
		this.bindPosts = props.bindPosts;
		this.propsState = props.history.location.state || {};
		this.state = {
			posts: [],
			generatePost: false,
			reloadPosts: this.propsState.reloadPosts || false,
			pageId: 1,
			pageLimit: 10,
			userId: props.match.params.user_id || props.currentUser.id
		}
	}

	componentDidMount() {
		this.loadPosts();
	}

	componentWillMount(){
	  window.addEventListener('scroll', this.loadMorePosts);
	}

	componentWillUnmount(){
    window.removeEventListener('scroll', this.loadMorePosts);
	}

	loadPosts = async () => {
		this.setState({loading: true});
		let posts = await getQuery(
			firestore.collection("posts").where("userId", "==", this.state.userId).orderBy("createdAt", "desc").limit(this.state.pageLimit).get()
		);
		posts = posts.sort((a,b) => b.createdAt - a.createdAt);
		this.setState({
			pageId: 2,
			posts,
			loading: false
		})
	}

	loadMorePosts = async () => {
    if (
    	window.innerHeight + document.documentElement.scrollTop >= document.scrollingElement.scrollHeight
    ) {
    	this.setState({loading: true});
      let posts = await getQuery(
  			firestore.collection("posts").where("userId", "==", this.state.userId).orderBy("createdAt", "desc").limit(this.state.pageLimit).get()
  		);
			posts = posts.sort((a,b) => b.createdAt - a.createdAt);
			this.setState({
				pageId: this.state.pageId + 1,
				posts,
				loading: false
			});
    }
	}

  subHeader = () => (
		<div className="dashboard-tabs" role="navigation" aria-label="Main">
			<div className="tabs -big">
				<div className="tab-item -active">Feelings ({this.state.posts.length})</div>
				<div className="tab-item" onClick={e => this.props.setActiveTab("activities")}>Activities</div>
			</div>
		</div>
  );

	render() {
		return (
			<div className="pt-2">
        {this.subHeader()}
        <div className="feeling-wrapper">
          {
            this.state.posts[0] && this.state.posts.map((post, idx) => post.stories && (
              <PostComponent currentUser={this.props.currentUser} post={post} key={idx}/>
            ))
          }
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

const mapDispatchToProps = (dispatch) => {
	return {
		bindPosts: (currentUser, type, ops) => dispatch(SetPosts(currentUser, type, ops))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(PostsComponent));
