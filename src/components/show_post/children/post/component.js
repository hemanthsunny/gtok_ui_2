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
import { HelmetMetaDataComponent, NotificationComponent } from "components";
import { PostCategories } from "constants/categories";

import {
	FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton, LinkedinIcon, LinkedinShareButton
} from "react-share";

const PostComponent = ({
	currentUser, post, bindPosts, hideSimilarityBtn=false, bindSharePost, hideShareBtn=false, hideRedirects=false, allUsers, bindUpdatedPost, purchaseOrders
}) => {
	const [ displayPost, setDisplayPost ] = useState(post);
	const [ postedUser, setPostedUser ] = useState("");
	const [ follower, setFollower ] = useState(!!displayPost.followers.find(f => f === currentUser.id));
	const [ followersCount, setFollowersCount ] = useState(displayPost.followers.length);
	const [ followerLoading, setFollowerLoading ] = useState(false);
	const [ result, setResult ] = useState({});
	const [ activeIndex, setActiveIndex ] = useState(0);
	const [ copied, setCopied ] = useState(false);
	const purchaseFound = purchaseOrders.find(order => (order.profileUserId === displayPost.userId && order.active));
	const history = useHistory();
	const displayPostUrl = "https://beta.letsgtok.com/app/posts/"+post.id;

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

	const slideTo = (action, idx) => {
		let totalSlides = displayPost.stories.length;
		if (action === "prev") {
			if (idx === 0) {
				setActiveIndex(totalSlides-1);
			} else {
				setActiveIndex(idx-1);
			}
		} else {
			if (idx === totalSlides-1) {
				setActiveIndex(0);
			} else {
				setActiveIndex(idx+1);
			}
		}
	}

	const copyLink = () => {
  	navigator.clipboard.writeText(displayPostUrl);
  	setCopied(true);
  	setTimeout(() => {
  		setCopied(false);
  	}, 1500);
  }

  return postedUser && displayPost.id && (
		<div>
	    <div className="card post-card-wrapper mt-4">
				<HelmetMetaDataComponent currentUrl={displayPostUrl} title={displayPost.category.title} description={displayPost.text} />
				<div>
					<span className="card-badge">{selectCategory(displayPost.categoryId)}</span>
					<div className="card-follow">
					{followerLoading ? <i className="fa fa-spinner fa-spin"></i> :
						<button className="btn btn-link p-0 pr-2" onClick={e => followPost(e)}>
							<i className={`fa fa-heart ${follower && "-active"}`}></i>
						</button>
					}
					</div>
				</div>
	      {
	        (displayPost.premium && !purchaseFound && (currentUser.id !== displayPost.userId)) ?
	        <div className="card-body">
	          <div className="blur-post">
	            This post is locked. <br/> To unlock this post, purchase premium of the profile user.
	          </div>
	          <Link to={`/app/profile/${displayPost.userId}/unlock_profile`} className="unlock-post">
	            Unlock post
	          </Link>
	        </div>
	        :
	  		  <div className="card-body">
				  	{
				  		displayPost.stories.map((story, idx) => (
						    <div className={`${idx!==activeIndex && "d-none"}`} key={idx}>
							  	<p className="white-space-preline">
										{story.text}
									</p>
					  			{ story.fileUrl &&
						    		<audio src={story.fileUrl} controls controlsList="nodownload"></audio>
									}
									{
										displayPost.stories.length > 1 &&
										<div className="carousel-effect">
											<span className="prev" onClick={e => slideTo("prev", idx)}>Prev</span>
											<span className="next" onClick={e => slideTo("next", idx)}>Next</span>
										</div>
									}
									<div className="clearfix my-4"></div>
									<div className="media card-details">
								  	{/*<img className="mr-2" src={postedUser.photoURL || gtokFavicon} alt="Card img cap" onClick={e => redirectToProfile()}/>*/}
									  <div className="media-body">
									    <h6>
												<span onClick={e => redirectToProfile()}>@{postedUser.displayName}</span>
												<div className="edit-options">
													<button className={`btn btn-link ${(displayPost.userId !== currentUser.id) && "d-none"}`} onClick={e => editPost(story, idx)}>
														<i className="fa fa-pencil"></i>
													</button>
													<button className={`btn btn-link ${(displayPost.userId !== currentUser.id) && "d-none"}`} onClick={e => deletePost(story, idx)}>
														<i className="fa fa-trash"></i>
													</button>
												</div>
									    </h6>
									    <span className="created-at">
									    	{moment(displayPost.createdAt).fromNow()}
									    </span>
									  </div>
								  </div>
								</div>
				  		))
				  	}
	  			</div>
	      }
	    </div>
			<div className="share-details">
				Share on {copied && <div className="copy-link-success">Link Copied</div>}
				<div className="d-flex flex-row justify-content-center">
					<div className="copy-link-icon" onClick={copyLink}>
						<i className="fa fa-link"></i>
					</div>
					<FacebookShareButton url={displayPostUrl} title={displayPost.category.title} quote={displayPost.text} hashtag="#letsgtok" className="socialMediaButton">
						<FacebookIcon size={36}/>
					</FacebookShareButton>
					<TwitterShareButton url={displayPostUrl} title={displayPost.text} hashtags="#letsgtok" className="socialMediaButton">
					 <TwitterIcon size={36} />
				 </TwitterShareButton>
				 <WhatsappShareButton url={displayPostUrl} title={displayPost.text} separator=":: " className="socialMediaButton">
					 <WhatsappIcon size={36} />
				 </WhatsappShareButton>
				 <LinkedinShareButton url={displayPostUrl} title={displayPost.text} summary={displayPost.category.title} source="Lets Gtok" className="socialMediaButton">
					 <LinkedinIcon size={36} />
				 </LinkedinShareButton>
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
