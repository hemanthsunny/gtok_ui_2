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
import { SidebarComponent } from "components";

const ParentComponent = (props) => {
	let sharePost = (props.history.location.state && props.history.location.state.sharePost) || {};
	let story = (props.history.location.state && props.history.location.state.story) || {
		text: "",
		fileUrl: null
	};
	let storyIdx = (props.history.location.state && props.history.location.state.storyIdx) || "";

	const { currentUser, bindNewPost } = props;
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
    <div className="dashboard-tabs" role="navigation" aria-label="Main">
			<div className="tabs -big">
				<Link to="/app/create_post" className="tab-item -active">Share Feeling</Link>
				<Link to="/app/create_activity" className="tab-item">Share Activity</Link>
			</div>
		</div>
  );


  return (
		<div>
			<HeaderComponent newAlertsCount={props.newAlertsCount} newMessagesCount={props.newMessagesCount} />
			<div>
        <SidebarComponent currentUser={currentUser} />
        <div className="dashboard-content">
			     {subHeader()}
			    <div className="container create-post-wrapper">
		        { stepNumber === 1 && <DetailComponent setStepNumber={setStepNumber} btnUpload={btnUpload} fileUrl={fileUrl} uploadAudio={uploadAudio} deleteFile={deleteFile} postText={postText} setPostText={setPostText} /> }
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
					</div>
				</div>
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
)(withRouter(ParentComponent));
