import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import HeaderComponent from "./header";
import DetailComponent from "./steps/detail/component";
import CategoryComponent from "./steps/category/component";
import SubmitComponent from "./steps/submit/component";

import { add, update, timestamp, uploadFile, removeFile, get, getId } from "firebase_config";
import { PostCategories } from "constants/categories";
import { capitalizeFirstLetter } from "helpers";
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
	const [ result, setResult ] = useState({});
	const [fileUrl, setFileUrl] = useState(story.fileUrl);
	const [btnUpload, setBtnUpload] = useState("Upload");
	const [ stepNumber, setStepNumber ] = useState(1);

	const savePost = async (opts) => {
		if (opts && opts.premium && (!props.prices || !props.prices[0])) {
			alert("Before you do a premium post, set a price in your profile");
			return null;
		}
		if (opts && opts.premium && (!props.wallet || !props.wallet[0])) {
			alert("Just before doing a premium post, please create a wallet");
			return null;
		}
		if (!postText) {
			alert("Write something before you post");
			return null;
		}
		if (!category.title) {
			alert("Please select a category");
			return null;
		}
		let result = "";
		let postData = {};
		if (sharePost.id) {
			sharePost.stories.splice(storyIdx, 1, {text: capitalizeFirstLetter(postText.trim()), fileUrl});
			postData = Object.assign(postData, {
				stories: sharePost.stories,
				category,
				categoryId: category.id,
				...opts
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
				timestamp,
				...opts
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
		}
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
				await update("posts", p.id, {stories: [{
  				text: p.text,
  				fileUrl: p.fileUrl || null,
  				createdAt: p.createdAt
				}]});
  		}
  	})
  }

  const subHeader = () => (
		<div className="d-flex flex-row justify-content-around feeling-sub-header">
			<div>
				<Link to="/app/create_post" className="">Feeling</Link>
			</div>
			<div>
				<Link to="/app/create_activity" className="">Activity</Link>
			</div>
		</div>
  );

  return (
		<div>
			<HeaderComponent newAlertsCount={props.newAlertsCount} newMessagesCount={props.newMessagesCount} />
			{subHeader()}
	    <div className="container create-post-wrapper">
        { stepNumber === 1 && <DetailComponent setStepNumber={setStepNumber} btnUpload={btnUpload} fileUrl={fileUrl} uploadAudio={uploadAudio} deleteFile={deleteFile} postText={postText} setPostText={setPostText} charCount={charCount}  setCharCount={setCharCount} /> }
        { stepNumber === 2 && <CategoryComponent setStepNumber={setStepNumber} postCategories={PostCategories} category={category} setCategory={setCategory} /> }
        { stepNumber === 3 && <SubmitComponent save={savePost} setStepNumber={setStepNumber} /> }
				<div className="text-center">
					{
						result.status &&
						<div className={`text-${result.status === 200 ? "success" : "danger"} mb-2`}>
							{result.message}
						</div>
					}
				</div>

		  	<button className="btn d-none" onClick={updateAdditionalStories}>UPDATE DB</button>
				{/*
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
		  	</div>
				*/}
			</div>
		</div>
  );
};

const mapStateToProps = (state) => {
	const { newAlertsCount } = state.alerts;
	const { newMessagesCount } = state.chatMessages;
	const { wallet } = state.wallet
	const { prices } = state.prices
	return { newAlertsCount, newMessagesCount, wallet, prices };
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
