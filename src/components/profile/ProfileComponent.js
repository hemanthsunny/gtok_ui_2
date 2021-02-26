import React, { useState, useEffect } from "react";
import { useHistory, withRouter, Link } from 'react-router-dom';
import { connect } from "react-redux";

import { NotificationComponent, SurveysComponent } from "components";
import { getId } from "firebase_config";
import { SetUser, SetLoggedIn, SetDbUser } from "store/actions";
import { capitalizeFirstLetter } from "helpers";

function ProfileComponent(props) {
	const { currentUser } = props;
	const userId = props.match.params.name;
	const defaultImage = "../logo192.png";
	const [ displayUser, setDisplayUser ] = useState();
	const [ loading, setLoading ] = useState(true);

	useEffect(() => {
		if (!userId) { 
			setLoading(false);
			alert("No user found")
			return;
		}
		async function getUser() {
			let user = await getId("users", userId);
			if (user && user.status === 404) setDisplayUser(null);
			else setDisplayUser(user);
			setLoading(false);
		}
		if (currentUser.id !== userId) {
			getUser();
		}
	}, [userId]);
  const history = useHistory();

	return (
	  <div className="container-fluid">
	  	{
	  		loading ? <div className="text-center">
	  			<i className="fa fa-spinner fa-spin"></i>
	  		</div> :
	  		!displayUser ? <div className="text-center">
	  			<h5><b>No user found</b></h5>
	  			<Link to="/app/search">Goto Search</Link>
	  		</div> :
	  		<div>
					<div className="text-center mb-3">
						<img 
							src={(displayUser && displayUser.photoURL) || defaultImage}
							alt="dp" 
							className="profilePic"
						/>
						<div className="d-flex justify-content-center mt-2">
							<button className="btn btn-sm btn-danger" onClick={e => displayFollowers(e)}>
								Followers <span className="badge badge-light">{displayUser && displayUser.followers && displayUser.followers.length}</span>
							</button>
					    <button className="btn btn-sm btn-primary ml-2" onClick={e => msgUser()}>
					    	Send Text
						  </button>
						</div>
				  </div>
					<div>
						<div className="form-group row">
					    <label htmlFor="userName" className="col-sm-2 col-form-label">Name</label>
					    <div className="col-sm-10">
					    	{displayUser && displayUser.displayName && capitalizeFirstLetter(displayUser.displayName)}
					    </div>
					  </div>
						<div className="form-group row">
					    <label htmlFor="dob" className="col-sm-2 col-form-label">Date of birth</label>
					    <div className="col-sm-10">
					    	{displayUser.dob}
					    </div>
					  </div>
						<div className="form-group row">
					    <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Email</label>
					    <div className="col-sm-10">
					    	{displayUser.email} &nbsp;
					    </div>
					  </div>
						<div className="text-center">
							<h6>
								<b>Badges</b> &nbsp;
								<span className="badge badge-secondary">{displayUser.badges && displayUser.badges.length}</span>
							</h6>
							{
								displayUser.badges ? displayUser.badges.map((badge, idx) => (
								  <button key={idx} className="btn btn-secondary btn-sm ml-2">{badge.title}</button>
								)) : <b className="text-secondary">No badges achieved yet. Unlock badges by filling surveys.</b>
							}
						</div>
						<div className="">
							Today, 0% similarity
							
						</div>
					</div>
				</div>
	  	}
	  </div>
	);
}

export default withRouter(ProfileComponent);