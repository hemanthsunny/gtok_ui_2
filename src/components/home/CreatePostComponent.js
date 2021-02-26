import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { add, update, timestamp, uploadFile, removeFile, get, getId } from "firebase_config";
import{
	NotificationComponent,
	HomeHeaderComponent
} from "components";
import { PostCategories } from "constants/categories";
import { capitalizeFirstLetter } from "helpers";
import { gtokBot } from "images";
import { SetNewPost } from "store/actions";

const CreatePostComponent = (props) => {
	let sharePost = (props.history.location.state && props.history.location.state.sharePost) || {};
	let story = (props.history.location.state && props.history.location.state.story) || {
		text: "",
		fileUrl: null
	};
	let storyIdx = (props.history.location.state && props.history.location.state.storyIdx) || "";

	const { currentUser, bindNewPost } = props;
	const [ charCount, setCharCount ] = useState(500-story.text.length);
	const [ postText, setPostText ] = useState(story.text);
	const [ category, setCategory ] = useState(sharePost.category || {});
	const [ postBtn, setPostBtn ] = useState("Post");
	const [ result, setResult ] = useState({});
	const [fileUrl, setFileUrl] = useState(story.fileUrl);
	const [btnUpload, setBtnUpload] = useState("Upload");

	const handleChange = (key, val) => {
		if (key === "post") {
			let chars = 500;
			setCharCount(chars - val.length);
			setPostText(val);
		}
		if (key === "category") {
			let cat = PostCategories.find(c => c.title === val);
			setCategory(cat);
		}
	}

	const savePost = async () => {
		if (!postText) {
			alert("Write something before you post");
			return null;
		}
		if (!category.title) {
			alert("Please select a category");
			return null;
		}
		setPostBtn("Posting");
		let result = "";
		let postData = {};
		if (sharePost.id) {
			sharePost.stories.splice(storyIdx, 1, {text: capitalizeFirstLetter(postText.trim()), fileUrl});
			postData = Object.assign(postData, {
				stories: sharePost.stories,
				category,
				categoryId: category.id
			});
			result = await update("posts", sharePost.id, postData);
			postData = Object.assign(postData, {id: sharePost.id});
  		await bindNewPost(postData);
		} else {
			postData = Object.assign(postData, {
				active: true,
				stories: [{
					text: capitalizeFirstLetter(postText.trim()),
					fileUrl
				}],
				userId: currentUser.id,
				followers: [],
				followersCount: 0,
				category,
				categoryId: category.id,
				timestamp
			});
			result = await add("posts", postData);
		}
  	/* Log the activity */
  	await add("logs", {
  		text: `${currentUser.displayName} created a post`,
  		photoURL: currentUser.photoURL,
  		receiverId: "",
  		userId: currentUser.id,
  		actionType: "create",
  		collection: "posts",
  		timestamp
  	});
		if (result.status === 200) {
			props.history.push({
				pathname: "/app/posts",
				state: { postingSuccess: true, reloadPosts: true }
			});
		} else {
			setResult(result);
			setPostBtn("Post");
		}
	}

	const cancelPost = () => {
		props.history.push({
  		pathname: "/app/posts",
  		state: {
  			reloadPosts: true
  		}
  	});
	}

  const uploadAudio = async (file) => {
  	if (!file) {
  		setResult({
  			status: 400,
  			message: 'A new audio required'
  		});
  		return null;
  	}
  	await uploadFile({
  		type: "audio",
  		file,
  		setBtnUpload,
  		setResult,
  		setFileUrl
  	});
  }

  const deleteFile = async () => {
  	if (window.confirm("Are you sure to remove audio clip?")) {
	  	await removeFile(fileUrl);
	  	setFileUrl("");
  	}
  }

  const nextpst = async (stories, id) => {
		let nxtPost = await getId("posts", id);
		stories.push({
			"text": nxtPost.text,
			"fileUrl": nxtPost.fileUrl,
			"createdAt": nxtPost.createdAt
		});
		if (nxtPost.nextId) { await nextpst(stories, nxtPost.nextId) }
		return stories;
  }

  const updateAdditionalStories = async () => {
  	let psts = await get("posts");
  	psts.map(async p => {
  		if (!p.stories && !p.prevId) {
  			console.log("p.id", p.id)
  		}
  		if (!p.prevId && p.nextId) {
  			let parentPst = p;
  			parentPst["stories"] = [
	  			{
	  				text: p.text,
	  				fileUrl: p.fileUrl,
	  				createdAt: p.createdAt
	  			}
  			];
				await nextpst(parentPst["stories"], parentPst.nextId);
				// console.log('res', res, ")))", parentPst);
				// await update("posts", p.id, {stories: parentPst["stories"]});
  		} else if (!p.prevId && !p.nextId) {
				console.log(")))", p.id, ")))", p);
				await update("posts", p.id, {stories: [{
  				text: p.text,
  				fileUrl: p.fileUrl || null,
  				createdAt: p.createdAt
				}]});
  		}
  	})
  }

  return (
		<div>
			<HomeHeaderComponent newAlertsCount={props.newAlertsCount} newMessagesCount={props.newMessagesCount} />
	    <div className="container">
		  	{
		  		result.status && <NotificationComponent result={result} setResult={setResult} />
		  	}
		  	<button className="btn d-none" onClick={updateAdditionalStories}>UPDATE DB</button>
		  	<div className="row">
		    	<div className="col-xs-12 col-md-9">
			      <div className="card create-post-card mt-2 mb-4">
			      	<div className="d-flex">
			      		<div className="col-12 font-xs-small card p-2 create-post-card-type" style={{backgroundColor: "#eee"}}>
			      			<div className="d-flex align-self-center">
			      				<i className="fa fa-pencil pr-1 mt-1"></i> &nbsp;
			      				<span>Share an experience / Pinch a feeling
			      				</span>
			      			</div>
			      		</div>
			      	</div>
			      	<div className="create-post">
					    	<textarea className="post-textbox font-xs-small" rows={5} placeholder={`${sharePost.id && !story.text ? "Continue your experience" : "Start typing here.. Ex: Love BBQ, BMW is my favorite car..."}`} maxLength="500" onChange={e => handleChange("post", e.target.value)} value={postText}></textarea>
								<div className="p-2 text-secondary text-center">
									<label htmlFor="staticAudioFile">
						    	{
						    		btnUpload === "Upload" ?
						    			fileUrl ?
							    		<div className="profile-pic-section">
								    		<audio src={fileUrl} controls controlsList="nodownload"></audio>
								    		<br/>
												<span className="btn-link btn-sm font-xs-small" onClick={deleteFile}>
													Remove audio
												</span>
											</div> :
											<div>
												<i className="fa fa-plus-circle"></i> &nbsp;
												<span className="font-small">Upload your experience as an audio clip</span>
											</div>
										: <div className="font-small"><i className="fa fa-spinner fa-spin"></i> {btnUpload !== "Upload" && btnUpload}</div>
						    	}
						    	</label>
						      <input type="file" className="form-control-plaintext d-none" id="staticAudioFile" onChange={e => uploadAudio(e.target.files[0])} accept="audio/*" />
							  </div>
								<div className="input-group px-1">
								  <div className="input-group-prepend">
								    <label className="input-group-text font-small" htmlFor="inputGroupSelect01">
								    This post is about your
								    </label>
								  </div>
								  <select className="custom-select font-small" id="inputGroupSelect01" onChange={e => handleChange("category", e.target.value)} value={category.title}>
								    <option value="">Choose...</option>
								    {
								    	PostCategories.map(category => (
								    		<option value={category.title} key={category.key}>
								    		{category.title}
								    		</option>
								    	))
								    }
								  </select>
								</div>
					    	<div className="px-1 py-2 pull-right">
					    		<button className="btn btn-outline-secondary btn-sm pull-right ml-2" onClick={cancelPost} disabled={postBtn !== "Post"}>
					    		Cancel
					    		</button>
					    		<button className="btn btn-secondary btn-sm pull-right" onClick={savePost} disabled={postBtn !== "Post"}>
					    		{sharePost.id ? "Update" : "Post"}
					    		</button>
					    		{
					    			(charCount !== 500) &&
						    		<small className="pull-right pr-2 pt-1">{charCount} chars left</small>
					    		}
					    	</div>
					    </div>
				    </div>
			    </div>
		    	<div className="d-none col-md-3 d-md-block mt-2">
		    		<div className="card right-sidebar-wrapper">
		    			<div className="card-body">
								<div className="d-flex profile-bot">
									<img src={gtokBot} alt="gtokBot" className="bot-icon" />
									<small className="bot-text">Your personal friend</small>
								</div>
								<hr/>
								<p className="profile-bot-description">
									Hi! I am your personal friend (a bot). I can chat, work and help you in daily activities. I am so happy to be your personal friend, {currentUser.displayName.split(" ")[0].toUpperCase()}. Will ping you once I am ready to chat...
								</p>
		    			</div>
		    		</div>
		    	</div>
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

const mapDispatchToProps = (dispatch) => {
	return {
		bindNewPost: (content) => dispatch(SetNewPost(content))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(CreatePostComponent));
