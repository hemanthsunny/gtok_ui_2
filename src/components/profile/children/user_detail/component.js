import React, { useState, useEffect } from "react";
import { Link, withRouter } from 'react-router-dom';
import { connect } from "react-redux";

import { getId } from "firebase_config";
import { capitalizeFirstLetter } from "helpers";
import { CustomImageComponent, SidebarComponent } from "components";
import { getQuery, add, update, uploadFile, timestamp, firestore } from "firebase_config";
import { SetDbUser } from "store/actions";
import { createRelationships } from "lib/api";

function Component(props) {
	const { currentUser, relations, purchaseOrders, bindDbUser } = props;
	const [ user, setUser ] = useState(currentUser);
	const [ btnUpload, setBtnUpload ] = useState("upload");
	const userId = props.match.params.user_id;
	const uniqName = user.username || user.displayName.toLowerCase().replace(/ /g, "_");
	const purchaseFound = purchaseOrders.find(order => (order.profileUserId === userId && order.purchaseOrderStatus === "active"));
	const [ follower, setFollower ] = useState("");
	const [ isFollowerLoading, setIsFollowerLoading ] = useState(false);

	useEffect(() => {
		async function getUser(uid) {
			let u = await getId("users", uid);
			u = Object.assign(u, { id: uid });
			setUser(u);
		}
		getUser(userId || currentUser.id);

		async function getFollowingStatus() {
			let rlns = await getQuery(
				firestore.collection("userRelationships").where("userIdOne", "==", currentUser.id).where("userIdTwo", "==", userId).get()
			);
			if (rlns[0]) setFollower(rlns[0]);
		}
		if (userId) {
			getFollowingStatus();
		}
	}, [userId]);

	const showEligibilityRules = () => {
		alert(`You must have at least 50 followers and 100 legitimate posts to use this feature.`);
		return null;
	}

	const uploadImage = async (file) => {
  	if (!file) {
			alert('A new image required');
  		return null;
  	}
		setBtnUpload("uploading...");
  	await uploadFile(file, "image", async (url, err) => {
			if (err) {
				alert(err);
				return null;
			}
			await update("users", user.id, { photoURL: url });
			bindDbUser(user);
		});
		setBtnUpload("upload");
		/* Log the activity */
  	await add("logs", {
  		text: `${user.displayName} added profile image`,
  		photoURL: user.photoURL,
  		receiverId: "",
  		userId: user.id,
  		actionType: "update",
  		collection: "users",
  		actionId: user.id,
  		actionKey: "photoURL",
  		timestamp
  	});
		// window.location.reload();
  }

	const deleteImage = async () => {
  	if (window.confirm("Are you sure you want to remove profile image?")) {
  		/* Don't remove source image. Affects in chats & alerts */
	  	// await removeImage(fileUrl);
			/* Log the activity */
	  	await add("logs", {
	  		text: `${user.displayName} removed profile image`,
	  		photoURL: "",
	  		receiverId: "",
	  		userId: user.id,
	  		actionType: "update",
	  		collection: "users",
	  		actionId: user.id,
	  		actionKey: "photoURL",
	  		timestamp
	  	});
	    await update("users", user.id, {photoURL: ""});
  	}
  }

	const updateFollowStatus = async () => {
		setIsFollowerLoading(true);
		let status = follower.status === 1 ? 0 : 1;

		if (follower) {
			console.log("fol", status)
			await update("userRelationships", follower.id, {status: status});
		} else {
			console.log("")
			let data = {
				userIdOne: currentUser.id,
				userIdTwo: userId,
				status
			}
			// await add("userRelationships", data);
		}
		let rlns = await getQuery(
			firestore.collection("userRelationships").where("userIdOne", "==", currentUser.id).where("userIdTwo", "==", userId).get()
		);
		if (rlns[0]) setFollower(rlns[0]);
		setIsFollowerLoading(false);
	}

	return (
	  <div className="container profile-wrapper pt-sm-4">
      <div className="card container profile-card">
        <div className="media profile-body">
					{
						(!userId || (userId === currentUser.id)) ?
						<label htmlFor="staticImage">
							{
				    		btnUpload === "upload" ?
								<CustomImageComponent user={user} size="lg" /> :
								<i className="fa fa-spinner fa-spin"></i>
							}
						</label> :
						<label>
							<CustomImageComponent user={user} size="lg" />
						</label>
					}
					<input type="file" className="form-control-plaintext d-none" id="staticImage" onChange={e => uploadImage(e.target.files[0])} accept="image/*" />
          <div className="media-body pl-2">
            <div className="profile-header">
							{user && capitalizeFirstLetter(user.displayName)}
							{
								(!userId || (userId === currentUser.id)) ?
									<Link to="/app/settings" className="btn btn-violet-outline btn-sm float-right"><i className="fa fa-cog"></i></Link> :
								<div className="d-flex flex-row float-right">
									<div className="btn btn-violet-outline btn-sm mr-2" onClick={updateFollowStatus}>
										{isFollowerLoading ? <i className="fa fa-spinner fa-spin"></i> : (follower.status === 1 ? "Unfollow" : "Follow")}
									</div>
									<Link to={`/app/chats/new/${userId}`} className="btn btn-violet-outline btn-sm"><i className="fa fa-comment"></i></Link>
								</div>
							}
						</div>
						<div className="profile-uniq-name">
							@{uniqName}
						</div>
          </div>
        </div>
				{user.bio &&
					<div className="profile-bio">
						<div className="label">About me</div>
						<div className="value">{user.bio}</div>
					</div>
				}
      </div>
			<div className="card posts-wrapper my-2 p-2">
				<div className="p-3 d-none">
					<Link to={`/app/profile/${userId || currentUser.id}/posts`} className="d-flex align-items-center">
						<img src={require(`assets/svgs/Plus.svg`).default} className="posts-icon pull-left" alt="Posts" />
						<span className="option-name col-8">Posts</span>
						<img src={require(`assets/svgs/RightArrow.svg`).default} className="right-icon col-3" alt="RightArrow" />
					</Link>
				</div>
				{
					userId && (userId !== currentUser.id) ?
					(
						purchaseFound ?
            <div className="posts-footer">
							<div className="col-xs-12 col-sm-10">
								Unlocked &nbsp;<b>@{uniqName}</b>&nbsp; inner feelings and secret activities &nbsp;
							</div>
							<div className="col-xs-12 col-sm-2 text-center pt-2 pt-sm-0">
								<button className="btn btn-sm btn-violet"><i className="fa fa-check"></i></button>
							</div>
						</div>
						:
						<div className="posts-footer">
							<div className="col-xs-12 col-sm-10">
								Unlock &nbsp;<b>@{uniqName}</b>&nbsp; inner feelings and secret activities &nbsp;
							</div>
							<div className="col-xs-12 col-sm-2 text-center pt-2 pt-sm-0">
								<button className="btn btn-sm btn-violet" onClick={e => alert(`@${uniqName} is not a premium user yet`)}>Purchase</button>
							</div>
						</div>
					) :
					<div className="posts-footer">
						<div className="col-xs-12 col-sm-10">
							Start making money by selling your inner feelings and activities
						</div>
						<div className="col-xs-12 col-sm-2 text-center pt-2 pt-sm-0">
							<button className="btn btn-sm btn-violet" onClick={showEligibilityRules}>Start Earning</button>
						</div>
					</div>
				}
			</div>
		</div>
	);
}

const mapStateToProps = (state) => {
	const { relations } = state.relationships;
	const { purchaseOrders } = state.purchaseOrders;
	return { relations, purchaseOrders };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindDbUser: (content) => dispatch(SetDbUser(content))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(Component));
