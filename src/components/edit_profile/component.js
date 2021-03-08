import React, { useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import MultiSelect from "react-multi-select-component";

import HeaderComponent from './header';
import { SidebarComponent } from "components";
import { SetDbUser } from "store/actions";
import { InterestedCategories } from "constants/categories";
import { add, update, timestamp } from "firebase_config";

function EditProfileComponent(props) {
  const { user, currentUser, bindDbUser } = props;
  const [ name, setName ] = useState(currentUser.displayName);
  const [ username, setUsername ] = useState(currentUser.username);
  const [ bio, setBio ] = useState(currentUser.bio || "");
  const [ selected, setSelected ] = useState(currentUser.interestedTopics || []);
  const [ result, setResult ] = useState({});
  const [ loading, setLoading ] = useState(false);

  const saveDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !name.trim()) {
    	alert("Display name is mandatory");
    	return null;
    }
    if (!username || !username.trim()) {
    	alert("Username is mandatory");
    	return null;
    }
    let data = {}
    if (name) { data = Object.assign(data, { displayName: name.toLowerCase().trim() })}
    if (username) { data = Object.assign(data, { username: username.toLowerCase().trim().replace(/ /g, "_") })}
    data = Object.assign(data, { interestedTopics: selected, bio });
    await updateDbUser(data);
		/* Log the activity */
  	await add("logs", {
  		text: `Profile edited`,
  		userId: currentUser.id,
  		collection: "users",
  		timestamp
  	});
    setLoading(false);
  };

  const updateDbUser = async (data) => {
    /* Update in firestore, instead of firebase auth */
    /* let res = await updateProfile(data); */
    let res = await update("users", currentUser.id, data);
    await bindDbUser({...currentUser, ...data});
  	setResult(res);
    setTimeout(() => {
      setResult("");
    }, 3000);
  }

  const subHeader = () => (
    <div className="dashboard-tabs -xs-d-none" role="navigation" aria-label="Main">
			<div className="tabs -big">
        <Link to="/app/settings" className="tab-item">Back</Link>
				<div className="tab-item -active">Edit Profile</div>
			</div>
		</div>
  );

	return (
    <div>
      <HeaderComponent newMessagesCount={props.newMessagesCount} newAlertsCount={props.newAlertsCount}/>
      <div>
				<SidebarComponent currentUser={currentUser} />
        <div className="dashboard-content">
          {subHeader()}
      	  <div className="container edit-profile-wrapper desktop-align-center">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <div className="">
                <input type="text" className="form-control" id="name" value={name} placeholder="Name" onChange={e => setName(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <div className="">
                <input type="text" className="form-control" id="username" value={username} placeholder="Username" onChange={e => setUsername(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="dob" className="form-label">Date of birth</label>
              <div>
                {currentUser.dob}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="staticEmail" className="form-label">Email</label>
              <div className="">
                {currentUser.email} &nbsp;
                <i className={`fa fa-${ user && user.emailVerified ? 'check text-success':'times text-danger'}`}  data-container="body" data-toggle="tooltip" data-placement="top" title={`${user.emailVerified ? "Verified" : "Not verified"}`}></i>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="staticEmail" className="form-label">Interested topics</label>
              <div className="">
                <MultiSelect
                  options={InterestedCategories}
                  value={selected}
                  onChange={setSelected}
                  labelledBy={"select"}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="userName" className="form-label">
                About me
              </label>
              <div className="">
                <textarea className="form-control" placeholder="Add your intro here" value={bio} onChange={e => setBio(e.target.value)}></textarea>
              </div>
        		</div>
            <button className="btn btn-sm btn-violet col-12" onClick={saveDetails}>Save</button>
            <div className="text-center">
              {
                result.status &&
                <div className={`text-${result.status === 200 ? "violet" : "danger"} my-2`}>
                  {result.message}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
	);
}

const mapStateToProps = (state) => {
	const { user } = state.authUsers;
  const { newAlertsCount } = state.alerts;
	const { newMessagesCount } = state.chatMessages;
	return { user, newAlertsCount, newMessagesCount };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindDbUser: (content) => dispatch(SetDbUser(content))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditProfileComponent);
