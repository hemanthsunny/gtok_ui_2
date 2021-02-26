import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import MultiSelect from "react-multi-select-component";

import {
	NotificationComponent,
	PermissionsComponent,
	DisplayPostComponent,
	ProfileSettingsComponent,
	ProfileHeaderComponent
} from "components";
import { add, update, uploadFile, timestamp } from "firebase_config";
import { SetUser, SetLoggedIn, SetDbUser } from "store/actions";
import { gtokFavicon } from "images";
import { capitalizeFirstLetter } from "helpers";
import { SetSelectedUserPosts, SetUserRelations } from "store/actions";
import { InterestedCategories } from "constants/categories";

function PrivateProfileComponent({
	user, currentUser, dbUser, bindLoggedIn, bindUser, bindDbUser, bindPosts, selectedUserPosts, singleUserRelations, bindUserRelations
}) {
	const defaultImage = gtokFavicon;
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState(dbUser.displayName);
	const [fileUrl, setFileUrl] = useState(dbUser.photoURL || defaultImage);
	const [bio, setBio] = useState(dbUser.bio || "");
	const [selected, setSelected] = useState(dbUser.interestedTopics || []);
	const [btnUpload, setBtnUpload] = useState('Upload');
	const [btnSave, setBtnSave] = useState("");
	// const [btnDelete, setBtnDelete] = useState('Delete Account');
	const [result, setResult] = useState({});
	const [activeOption, setActiveOption] = useState("profile");
  // const pathDetails = {
  // 	path: "/app/profile",
  // 	isNewPath: true
  // }
  useEffect(() => {
	  bindPosts(dbUser, "selectedUser", {sort: true});
	  bindUserRelations({}, dbUser, 1);
  }, [bindPosts, dbUser, bindUserRelations]);

  // Window handlers
	window.jQuery('[data-toggle="popover"]').popover();

  const handleChange = async (key, value) => {
  	if (key === "name") {
  		setName(value);
  	}
  }

  const saveDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !name.trim()) {
    	alert("Display name is mandatory");
    	return null;
    }
    let data = {}
    if (name) { data = Object.assign(data, { displayName: name.toLowerCase().trim() })}
    if (fileUrl) {
    	data = Object.assign(data, { photoURL: fileUrl })
    	setBtnUpload("Upload");
    }
    data = Object.assign(data, {interestedTopics: selected, bio});
    await updateDbUser(data);
		/* Log the activity */
  	await add("logs", {
  		text: `${dbUser.displayName} updated profile`,
  		photoURL: dbUser.photoURL,
  		receiverId: "",
  		userId: dbUser.id,
  		actionType: "update",
  		collection: "users",
  		actionId: dbUser.id,
  		actionKey: "displayName",
  		timestamp
  	});
    setBtnSave("");
    setLoading(false);
  };

  const updateDbUser = async (data) => {
    /* Update in firestore, instead of firebase auth */
    /* let res = await updateProfile(data); */
    let res = await update("users", dbUser.id, data);
    await bindDbUser({...dbUser, ...data});
  	setResult(res);
  }

  const undoDetails = () => {
  	setName(dbUser.displayName);
  	setFileUrl(dbUser.photoURL);
  	setBtnSave("");
  }

  const uploadImage = async (file) => {
  	if (!file) {
  		setResult({
  			status: 400,
  			message: 'A new image required'
  		});
  		return null;
  	}
    setBtnSave("image");
  	await uploadFile({
  		file, setBtnUpload, setResult, setFileUrl
  	});
		/* Log the activity */
  	await add("logs", {
  		text: `${dbUser.displayName} added profile image`,
  		photoURL: dbUser.photoURL,
  		receiverId: "",
  		userId: dbUser.id,
  		actionType: "update",
  		collection: "users",
  		actionId: dbUser.id,
  		actionKey: "photoURL",
  		timestamp
  	});
  }

  const deleteImage = async () => {
  	if (window.confirm("Are you sure you want to remove profile image?")) {
  		/* Don't remove source image. Affects in chats & alerts */
	  	// await removeImage(fileUrl);
			/* Log the activity */
	  	await add("logs", {
	  		text: `${dbUser.displayName} removed profile image`,
	  		photoURL: "",
	  		receiverId: "",
	  		userId: dbUser.id,
	  		actionType: "update",
	  		collection: "users",
	  		actionId: dbUser.id,
	  		actionKey: "photoURL",
	  		timestamp
	  	});
	  	setFileUrl(defaultImage);
	    await updateDbUser({ photoURL: defaultImage });
  	}
  }

  // const displayFollowers = async () => {
  // 	if (!currentUser.premium) {
	 //  	alert("You cannot see followers at this time.");
	 //  	return;
  // 	}
  // }

  const updateElements = () => (
		btnSave && <div className="mt-2">
		<button className="btn btn-sm btn-outline-success" onClick={saveDetails}><i className="fa fa-check"></i></button>
		<button className="btn btn-sm btn-outline-danger ml-2" onClick={undoDetails}><i className="fa fa-times"></i></button>
		</div>
  );

	return (
		<div>
			<ProfileHeaderComponent username={currentUser.displayName}/>
		  <div className="container">
		  	{
		  		result.status ? <NotificationComponent result={result} setResult={setResult} /> : ''
		  	}
					<div className="text-center mb-3">
				    <label htmlFor="staticImage">
				    	{
				    		btnUpload === "Upload" ?
				    		<div className="profile-pic-section">
					    		<img
										src={fileUrl}
										alt="dp"
										className="profilePic"
									/>
									<span className="hover-text">
									<i className="fa fa-plus"></i> &nbsp;
									Upload </span>
								</div> : <div className="profilePic text-center"><i className="fa fa-spinner fa-spin"></i></div>
				    	}
						</label>
						<span className={`icon-bg-dark ${defaultImage === fileUrl ? 'd-none' : ''}`} onClick={deleteImage} title="Delete image">
							<i className="fa fa-trash"></i>
						</span>
						{btnSave==="image" && updateElements()}
						<br/>
						<h5 className="mb-0 mt-2">
							{dbUser.displayName && capitalizeFirstLetter(dbUser.displayName)}
						</h5>
						<Link to="/app/search" className="text-secondary font-small py-0">
							{singleUserRelations.length} follower{singleUserRelations.length !== 1 && "s"}
						</Link>
				  </div>
			  	<hr className="my-1"/>
				  <div className="d-flex flex-row profile-options justify-content-center">
				  	<div className="option" onClick={e => setActiveOption("profile")}>
				  		Profile
				  		<div className={activeOption === "profile" ? "active":"d-none"}></div>
				  	</div>
				  	<div className="option" onClick={e => setActiveOption("posts")}>
				  		Posts
				  		<div className={activeOption === "posts" ? "active":"d-none"}></div>
				  	</div>
				  	<div className="option" onClick={e => setActiveOption("permissions")}>
				  		Permissions
				  		<div className={activeOption === "permissions" ? "active":"d-none"}></div>
				  	</div>
				  	<div className="option" onClick={e => setActiveOption("settings")}>
				  		Settings
				  		<div className={activeOption === "settings" ? "active":"d-none"}></div>
				  	</div>
				  </div>
				  <hr className="my-0 mb-2"/>
	      	{
	      		activeOption === "posts" &&
	      		<div className="mt-3">
	      			{
		      		!!selectedUserPosts[0] ? selectedUserPosts.map((post, idx) => (
		      			<DisplayPostComponent currentUser={currentUser} post={post} key={idx} />
		      		)) : <div className="card text-center mt-2 p-2 text-secondary">No posts found</div>
		      		}
		      	</div>
	      	}
	      	{ activeOption === "profile" &&
			      <div className="card card-br-0 p-2 mt-2 font-xs-small">
							<div className="form-group row">
						    <label htmlFor="userName" className="col-sm-4 col-form-label">Name</label>
						    <div className="col-sm-8">
						      <input type="text" className="form-input" id="userName" value={name} placeholder="Display name" onChange={e => handleChange("name", e.target.value)} />
						    </div>
						  </div>
							<div className="form-group row">
						    <label htmlFor="dob" className="col-sm-4 col-form-label">Date of birth</label>
						    <div className="col-sm-8">
						    	{dbUser.dob}
						    </div>
						  </div>
							<div className="form-group row">
						    <label htmlFor="staticEmail" className="col-sm-4 col-form-label">Email</label>
						    <div className="col-sm-8">
						    	{dbUser.email} &nbsp;
					    		<i className={`fa fa-${ user && user.emailVerified ? 'check text-success':'times text-danger'}`}  data-container="body" data-toggle="popover" data-placement="top" data-content={`${user.emailVerified ? "Verified" : "Not verified"}`}></i>
						    </div>
						  </div>
							<div className="form-group row">
						    <label htmlFor="staticEmail" className="col-sm-4 col-form-label">Interested topics</label>
						    <div className="col-sm-8">
						    	<MultiSelect
						    		options={InterestedCategories}
						    		value={selected}
						    		onChange={setSelected}
						    		labelledBy={"select"}
						    	/>
						    </div>
						  </div>
							<div className="form-group row">
						    <label htmlFor="userName" className="col-sm-4 col-form-label">
						    	Bio
						    </label>
						    <div className="col-sm-8">
						    	<textarea className="form-control" placeholder="Add your intro here" onChange={e => setBio(e.target.value)}></textarea>
						    </div>
						  </div>
				  		<div className="text-center">
					    	{
					    		result.status &&
					    		<div className={`text-${result.status === 200 ? "success" : "danger"} mb-2`}>
							    	{result.message}
					    		</div>
					    	}
			  				<button className="btn btn-sm btn-outline-secondary" onClick={saveDetails}>
									Save {loading &&<i className="fa fa-spinner fa-spin"></i>}
								</button>
							</div>
						  { dbUser.admin &&
								<div className="form-group row">
							    <label htmlFor="verified" className="col-sm-2 col-form-label">Admin</label>
							    <div className="col-sm-10">
							    	<i className="fa fa-check"></i>
							    </div>
							  </div>
						  }
							<div className="form-group row">
						    <div className="col-sm-4">
						      <input type="file" className="form-control-plaintext d-none" id="staticImage" onChange={e => uploadImage(e.target.files[0])} accept="image/*" />
						    </div>
						  </div>
						</div>
					}
					{	activeOption === "permissions" &&
						<PermissionsComponent currentUser={dbUser} />
					}
					{	activeOption === "settings" &&
						<ProfileSettingsComponent currentUser={dbUser} />
	      	}
		  </div>
		</div>
	);
}

const mapStateToProps = (state) => {
	const { dbUser, user } = state.authUsers;
	const { selectedUserPosts } = state.posts;
	const { singleUserRelations } = state.relationships;
	return { dbUser, user, selectedUserPosts, singleUserRelations };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindLoggedIn: (content) => dispatch(SetLoggedIn(content)),
		bindUser: (content) => dispatch(SetUser(content)),
		bindDbUser: (content) => dispatch(SetDbUser(content)),
		bindPosts: (content, type, data) => dispatch(SetSelectedUserPosts(content, type, data)),
		bindUserRelations: (cUser, dUser, status) => dispatch(SetUserRelations(cUser, dUser, status))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PrivateProfileComponent);
