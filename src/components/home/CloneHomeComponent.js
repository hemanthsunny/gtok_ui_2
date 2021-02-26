import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import $ from "jquery";

import { 
	DisplayPostComponent,
	GeneratePostComponent,
	LoadingComponent
} from "components";
import { SetPosts } from "store/actions";
import { get, getId, getQuery, firestore } from "firebase_config";

const HomeComponent = (props) => {
	// const { currentUser, posts, bindPosts } = props;
	const { currentUser, bindPosts } = props;
	const [ generatePost, setGeneratePost ] = useState(false);
	let propsState = props.history.location.state || {};
	const [ reloadPosts, setReloadPosts ] = useState(propsState.reloadPosts || false);
	const [ lastPost, setLastPost ] = useState("");
	const [ posts, setPosts ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ loadMore, setLoadMore ] = useState(false);

	useEffect(() => {
		// if (!posts[0]) bindPosts(currentUser);
		// if (reloadPosts) {
		// 	bindPosts(currentUser);
		// 	setReloadPosts(false);
		// }
		async function loadPosts() {
			let pos = await getQuery(
				firestore.collection("posts").orderBy('createdAt', 'desc').limit(5).get()
			);
			console.log("pos", pos);
			pos = pos.sort((a,b) => b.createdAt - a.createdAt);
			setPosts(pos);
			setLastPost(pos[pos.length-1])
		}
		if (!posts[0]) {
			loadPosts();
		}
		async function loadMorePosts() {
			setLoading(true);
			console.log("lastpost", lastPost["createdAt"])
	    // ajax call get data from server and append to the div
			let pos = await getQuery(
				firestore.collection("posts").orderBy('createdAt', 'desc').startAfter(lastPost["createdAt"]).limit(5).get()
			);
			pos = pos.sort((a,b) => b.createdAt - a.createdAt);
			console.log("LOAd more posts", pos);
			console.log("posts", pos.length, posts.length);
			setLastPost(pos[pos.length-1]);
			setPosts([...posts, ...pos]);
			setLoadMore(false);
			setLoading(false);
		}
		$(window).scroll(function() {
	    if($(window).scrollTop() == $(document).height() - $(window).height()) {
	    	setLoadMore(true);
	    	if (loadMore) loadMorePosts();
	    }
		});
	}, [bindPosts, currentUser, posts, propsState, reloadPosts]);

  return (
    <div className="container">
      <div className="card create-post-card mt-2 mb-4">
      {/*
      	<div className="d-flex">
      		<div className="col-6 font-xs-small card p-2 create-post-card-type" style={{backgroundColor: (postType !== "bot" ? "#eee" : "white")}} onClick={e => setPostType("human")}><i className="fa fa-pencil"></i>&nbsp;Type a post</div>
      		<div className="col-6 font-xs-small card p-2 create-post-card-type" style={{backgroundColor: (postType === "bot" ? "#eee" : "white")}} onClick={e => setPostType("bot")}>Automate a post</div>
      	</div>
      */}
      	<div className="d-flex">
      		<div className="col-12 font-xs-small card p-2 create-post-card-type" style={{backgroundColor: "white"}} onClick={e => props.history.push("/app/create_post")}>
      			<div className="d-flex align-self-center">
      				<i className="fa fa-pencil pr-1 mt-1"></i> &nbsp;
      				<span>Share an experience / Pinch a feeling. Click here</span>
      			</div>
      		</div>
      	</div>
      	{/*
      		postType === "bot" &&
      		<div className="">
      			<p className="p-3 px-md-5 text-center text-secondary">
      			Answer few questions and our Gtok Bot generates a post for you.<br/>
      			<button className="btn btn-link text-center" onClick={e => setGeneratePost(true)}>
      			Generate Post
      			</button>
      			</p>
<button className="btn btn-link text-center" onClick={loadMorePosts}>Load more</button>
			
      		</div>*/
      	}
	    </div>
	    {
	    	posts[0] && posts.map((post, idx) => (
		    	<DisplayPostComponent currentUser={currentUser} post={post} key={idx}/>
	    	))
	    }
	    {loading && <LoadingComponent /> }
	    {
				generatePost && <GeneratePostComponent setOpenModal={setGeneratePost} currentUser={currentUser} />
			}
		</div>
  );
};

const mapStateToProps = (state) => {
	const { posts } = state.posts;
	return { posts };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindPosts: (content) => dispatch(SetPosts(content))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(HomeComponent));