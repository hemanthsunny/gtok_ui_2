import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import moment from "moment";
import $ from "jquery";

import {
	add,
	arrayAdd,
	arrayRemove,
	getId,
	update,
	remove,
	removeFile,
	timestamp
} from "firebase_config";
import { gtokFavicon } from "images";
import { capitalizeFirstLetter } from "helpers";
import { SetPosts, SetSharePost, SetUpdatedPost } from "store/actions";
import { NotificationComponent } from "components";
import { PostCategories } from "constants/categories";

const PostComponent = ({
	currentUser, post, bindPosts, hideSimilarityBtn=false, bindSharePost, hideShareBtn=false, hideRedirects=false, allUsers, bindUpdatedPost, purchaseOrders
}) => {
	const [ displayPost, setDisplayPost ] = useState(post);
	const [ postedUser, setPostedUser ] = useState("");
	const [ follower, setFollower ] = useState(!!displayPost.followers.find(f => f === currentUser.id));
	const [ followersCount, setFollowersCount ] = useState(displayPost.followers.length);
	const [ followerLoading, setFollowerLoading ] = useState(false);
	const [ result, setResult ] = useState({});
	const purchaseFound = purchaseOrders.find(order => (order.profileUserId === displayPost.userId && order.active));
	const history = useHistory();

	useEffect(() => {
		async function getPostedUser() {
			let result = allUsers.find(user => user.id === displayPost.userId);
			if (!result) {
				result = await getId("users", displayPost.userId);
			}
			result["id"] = displayPost.userId;
			setPostedUser(result);
		}
		getPostedUser();
		function enableSwipe() {
			$(".carousel").on("touchstart", function(event){
        let xClick = event.originalEvent.touches[0].pageX;
		    $(this).one("touchmove", function(event){
	        let xMove = event.originalEvent.touches[0].pageX;
	        if(Math.floor(xClick - xMove) > 5){
	          $(this).carousel('next');
	        }
	        else if( Math.floor(xClick - xMove) < -5 ){
	          $(this).carousel('prev');
	        }
		    });
		    $(".carousel").on("touchend", function(){
		      $(this).off("touchmove");
		    });
			});
		}
		enableSwipe();
	}, [displayPost, allUsers]);

	const followPost = async (e) => {
		// if (currentUser.id === postedUser.id) {
		// 	alert("You cannot follow yourself.")
		// 	return null;
		// }
		setFollowerLoading(true);
  	if (!follower) {
	  	await update("posts", displayPost.id, { followers: arrayAdd(currentUser.id), followersCount: displayPost.followers.length+1 });
  		/* Log the activity */
	  	await add("logs", {
	  		text: `${currentUser.displayName} pinches your post`,
	  		photoURL: currentUser.photoURL,
	  		receiverId: postedUser.id,
	  		userId: currentUser.id,
	  		actionType: "update",
	  		collection: "posts",
	  		actionId: displayPost.id,
	  		actionKey: "followers",
	  		actionLink: "/app/posts/"+displayPost.id,
	  		timestamp
	  	});
	  	setFollower(true);
  	} else {
	  	await update("posts", displayPost.id, { followers: arrayRemove(currentUser.id), followersCount: displayPost.followers.length-1 });
  		/* Log the activity */
	  	await add("logs", {
	  		text: `${currentUser.displayName} removed pinch for your post`,
	  		photoURL: currentUser.photoURL,
	  		receiverId: "",
	  		userId: currentUser.id,
	  		actionType: "update",
	  		collection: "posts",
	  		actionId: displayPost.id,
	  		actionKey: "followers",
				actionLink: "/app/posts/"+displayPost.id,
	  		timestamp
	  	});
	  	setFollower(false);
  	}
  	await getUpdatedPost(displayPost.id)
  	setFollowerLoading(false);
	}

	const selectCategory = (id) => {
		let category = PostCategories.find(c => c.id === id);
		return category.title;
	}

	const getUpdatedPost = async (id) => {
		await bindUpdatedPost(currentUser, "id", {id});
		let res = await getId("posts", id);
		setFollowersCount(res.followers.length);
	}

	const deletePost = async (post, idx) => {
		if (displayPost.id && window.confirm("Are you sure to delete this post?")) {
			let result;
			if (displayPost.stories.length === 1) {
				result = await remove("posts", displayPost.id);
			} else {
				if (post.fileUrl) {
					await removeFile(post.fileUrl);
				}
				displayPost.stories.splice(idx, 1);
				result = await update("posts", displayPost.id, { stories: displayPost.stories });
				setDisplayPost(displayPost);
			}
  		/* Log the activity */
	  	await add("logs", {
	  		text: `${currentUser.displayName} removed the post`,
	  		photoURL: currentUser.photoURL,
	  		receiverId: "",
	  		userId: currentUser.id,
	  		actionType: "delete",
	  		collection: "posts",
	  		actionId: displayPost.id,
	  		actionKey: "id",
				actionLink: "/app/profile/"+currentUser.id,
	  		timestamp
	  	});
			setResult(result);
			// await bindPosts(currentUser);
		}
	}

	const sharePost = async () => {
		await bindSharePost(currentUser, "id", {post});
		history.push("/app/posts/"+displayPost.id);
	}

	const redirectToProfile = async () => {
		if (!hideRedirects) {
			history.push("/app/profile/"+displayPost.userId);
		}
	}

	const editPost = (post, idx) => {
		if (displayPost.id) {
			history.push({
	  		pathname: "/app/create_post",
	  		state: {
	  			sharePost: displayPost,
	  			story: post,
	  			storyIdx: idx
	  		}
	  	});
		}
	}

	const addPost = (idx) => {
		if (displayPost.id) {
			history.push({
	  		pathname: "/app/create_post",
	  		state: {
	  			sharePost: displayPost,
	  			story: {text: "", fileUrl: null},
	  			storyIdx: idx
	  		}
	  	});
		}
	}

  return postedUser && displayPost.stories && (
    <div className="card card-br-0 mb-4 pb-2">
	  	{
	  		result.status && <NotificationComponent result={result} setResult={setResult} />
	  	}
			<div className="media post-card-image p-2 text-secondary">
		  	<img className="mr-2" src={postedUser.photoURL || gtokFavicon} alt="Card img cap" onClick={e => redirectToProfile()}/>
			  <div className="media-body">
			    <h6 className="my-0 text-camelcase font-small">
			    	{capitalizeFirstLetter(postedUser.displayName)}
			    </h6>
			    <span className="font-small" title="Posted time">
			    <i className="fa fa-clock-o"></i>&nbsp;{moment(displayPost.createdAt).fromNow()}
			    </span>
			    <span className="font-small ml-2" title="Post category">
			    <i className="fa fa-tag"></i>&nbsp;{selectCategory(displayPost.categoryId)}
			    </span>
			  </div>
		  </div>
      {
        (displayPost.premium && !purchaseFound && (currentUser.id !== displayPost.userId)) ?
        <div className="card-body text-center">
          <div className="blur-post">
            This post is locked. <br/> To unlock this post, purchase premium of the profile user.
          </div>
          <Link to={`/app/profile/${displayPost.userId}/unlock_profile`} className="unlock-post">
            Unlock post
          </Link>
        </div>
        :
  		  <div className="card-body text-center">
    			<div id={displayPost.id} className="carousel slide" data-ride="carousel" data-interval="false">
  				  <div className="carousel-inner">
  				  	{
  				  		displayPost.stories.map((story, idx) => (
  						    <div className={`carousel-item ${idx===0 && "active"}`} key={idx}>
  							  	<p className="white-space-preline">{story.text}</p>
  					  			{ story.fileUrl &&
  						    		<audio src={story.fileUrl} controls controlsList="nodownload"></audio>
  									}
  				  		  	{
  						    		(displayPost.userId === currentUser.id) &&
  				    				<div className="d-inline">
  				    					<br/>
  							        <button className="btn btn-link" onClick={e => editPost(story, idx)}>
  							        	<i className="fa fa-pencil text-secondary"></i>
  							        </button>
  							        <button className="btn btn-link" onClick={e => deletePost(story, idx)}>
  							        	<i className="fa fa-trash text-secondary"></i>
  							        </button>
  				    				</div>
  						    	}
  								</div>
  				  		))
  				  	}
  				  </div>
  				  {displayPost.stories.length > 1 &&
  					  <a className="carousel-control-prev" href={`#${displayPost.id}`} role="button" data-slide="prev">
  					    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
  					    <span className="sr-only">Previous</span>
  					  </a>
  					}
  				  {displayPost.stories.length > 1 &&
  					  <a className="carousel-control-next" href={`#${displayPost.id}`} role="button" data-slide="next">
  					    <span className="carousel-control-next-icon" aria-hidden="true"></span>
  					    <span className="sr-only">Next</span>
  					  </a>
  					}
  				</div>
  			</div>
      }

			<div className="post-card-footer">
				<div className="pull-left">
				  {followerLoading ? <i className="fa fa-spinner fa-spin"></i> :
					  <button className="btn btn-link btn-sm ml-2 fs-15" onClick={e => followPost(e)}>
				  		<i className={`fa fa-heart ${follower ? "text-danger" : "text-secondary"}`}></i> &nbsp;
				  		<span className={`${follower ? "text-danger" : "text-secondary"}`}>{followersCount}</span>
					  </button>
					}
				  {
				  	!hideShareBtn &&
					  <button className="btn btn-link btn-sm ml-2 fs-15 text-secondary" onClick={sharePost}>
					  	<i className="fa fa-share-alt"></i>
					  </button>
					}
				</div>
				<div className="pull-right">
			  	{
			  		(displayPost.userId === currentUser.id) &&
				  	<button className="btn btn-link text-secondary btn-sm mr-2" onClick={e => addPost(displayPost.stories.length)}>
				  		<i className="fa fa-plus"></i>
				  	</button>
				  }
				</div>
	  		<div className="mt-2 d-none">
			  	{
			  		currentUser.id !== displayPost.userId &&
				  	<button className="btn btn-outline-secondary btn-sm font-xs-small ml-2" title="Number of similar people" onClick={e => followPost(e)}>
				  		{followerLoading ? <i className="fa fa-spinner fa-spin"></i> :
				  			<div>
						  		<i className={`fa fa-heart ${follower && "text-danger"}`}></i> &nbsp;
						  		{follower ? "Remove Pinch" : "Same Pinch"}
				  			</div>
				  		}
				  	</button>
				  }
			  	{
			  		currentUser.id !== displayPost.userId && !hideSimilarityBtn &&
				    <Link to={"/app/profile/"+displayPost.userId} className="btn btn-outline-secondary btn-sm ml-2 font-xs-small" title={"Show similarities with "+postedUser.displayName && postedUser.displayName.split(" ")[0]}>
				    	<i className="fa fa-bar-chart"></i> &nbsp;
					    Similarities
				    </Link>
				  }
				  {/*
				  	!hideShareBtn &&
					  <button className="btn btn-outline-secondary btn-sm ml-2 font-xs-small" onClick={e => sharePost()}>
					  	<i className="fa fa-share-alt"></i>
					  </button>*/
				  }
			  </div>
		  </div>
    </div>
  );
};

const mapStateToProps = (state) => {
	const { allUsers } = state.users;
  const { purchaseOrders } = state.purchaseOrders;
	return { allUsers, purchaseOrders };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindPosts: (content) => dispatch(SetPosts(content)),
		bindSharePost: (content, type, data) => dispatch(SetSharePost(content, type, data)),
		bindUpdatedPost: (content, type, data) => dispatch(SetUpdatedPost(content, type, data)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PostComponent);
