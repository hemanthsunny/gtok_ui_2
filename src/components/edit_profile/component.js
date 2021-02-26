import React, { useState } from "react";
import { connect } from "react-redux";
import MultiSelect from "react-multi-select-component";

import HeaderComponent from './header';
import { SetDbUser } from "store/actions";
import { InterestedCategories } from "constants/categories";
import { add, update, timestamp } from "firebase_config";

function EditProfileComponent({ user, currentUser, bindDbUser }) {
  window.jQuery('[data-toggle="tooltip"]').tooltip();

  const [ name, setName ] = useState(currentUser.displayName);
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
    let data = {}
    if (name) { data = Object.assign(data, { displayName: name.toLowerCase().trim() })}
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
  }

	return (
    <div>
      <HeaderComponent save={saveDetails} loading={loading}/>
      <div className="text-center">
        {
          result.status &&
          <div className={`text-${result.status === 200 ? "success" : "danger"} mb-2`}>
            {result.message}
          </div>
        }
      </div>
  	  <div className="container edit-profile-wrapper">
        <div className="form-group row">
          <label htmlFor="userName" className="col-sm-4 form-label">Name</label>
          <div className="col-sm-8">
            <input type="text" className="form-control" id="userName" value={name} placeholder="Display name" onChange={e => setName(e.target.value)} />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="dob" className="col-sm-4 form-label">Date of birth</label>
          <div className="col-sm-8">
            {currentUser.dob}
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-4 form-label">Email</label>
          <div className="col-sm-8">
            {currentUser.email} &nbsp;
            <i className={`fa fa-${ user && user.emailVerified ? 'check text-success':'times text-danger'}`}  data-container="body" data-toggle="tooltip" data-placement="top" title={`${user.emailVerified ? "Verified" : "Not verified"}`}></i>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-4 form-label">Interested topics</label>
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
          <label htmlFor="userName" className="col-sm-4 form-label">
            Bio
          </label>
          <div className="col-sm-8">
            <textarea className="form-control" placeholder="Add your intro here" value={bio} onChange={e => setBio(e.target.value)}></textarea>
          </div>
    		</div>
      </div>
    </div>
	);
}

const mapStateToProps = (state) => {
	const { user } = state.authUsers;
	return { user };
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
