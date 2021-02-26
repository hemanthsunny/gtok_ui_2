import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";

import { changePassword, signout } from "firebase_config";
import { SetUser, SetLoggedIn, SetDbUser } from "store/actions";

function ProfileSettingsComponent({ currentUser, bindLoggedIn, bindUser, bindDbUser }) {
	const [btnSignout, setBtnSignout] = useState('Logout');
	const [result, setResult] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [eyeIcon, setEyeIcon] = useState("fa-eye");
  const history = useHistory();

  const signoutUser = async () => {
  	setBtnSignout("Working...");
  	await signout();
  	await bindLoggedIn(false);
    await bindDbUser(null);
  	await bindUser(null);
  	history.push("/logout");
  }
/*
  const deleteAccount = async (e) => {
  	e.preventDefault();
  	setBtnDelete('Deleting...');
  	await remove('users', dbUser.id)
  	await removeProfile();
		history.push('/profile_deleted');
  }
*/

  const updatePassword = async () => {
  	if (newPassword !== confirmNewPassword) {
  		alert("Passwords donot match");
  		return null;
  	}
  	let res = await changePassword(newPassword);
		setNewPassword("");
		setConfirmNewPassword("");
  	setResult(res);
  }

  const showPassword = () => {
  	let input = document.getElementById("newPass");
  	if (input.type === "password") {
  		setEyeIcon("fa-eye-slash");
  		input.type = "text";
  	} else {
  		setEyeIcon("fa-eye");
  		input.type = "password"
  	}
  }

	return (
	  <div>
			<div id="accordion">
		    <div id="headingOne" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
		    	<div className="d-flex align-items-center">
		        <button className="btn btn-link btn-sm text-left flex-grow-1 decoration-none text-default" >
		          Change Password
		        </button>
		        <i className="fa fa-chevron-down font-small"></i>
	        </div>
		    </div>
		    <div id="collapseOne" className="collapse change-password-form" aria-labelledby="headingOne" data-parent="#accordion">
		    	<div className="form-group">
		    		<label>New Password</label>
		    		<input type="password" className="form-control" id="newPass" onChange={e => setNewPassword(e.target.value)}/>
		    		<i className={`fa ${eyeIcon} show-password`} onClick={e => showPassword()}></i>
		    	</div>
		    	<div className="form-group">
		    		<label>Repeat New Password</label>
		    		<input type="password" className="form-control" onChange={e => setConfirmNewPassword(e.target.value)}/>
		    	</div>
		    	{result.status &&
		    		<div className={`text-${result.status === 200 ? "success" : "danger"} mb-2`}>
				    	{result.message}
		    		</div>
		    	}
		    	<button className="btn btn-sm btn-outline-secondary" onClick={updatePassword}>Update</button>
		    </div>
		    <hr className="my-1"/>
		    <div id="headingTwo">
	        <button className="btn btn-link btn-sm text-default" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"disabled={btnSignout !== 'Logout'} onClick={signoutUser}>{btnSignout}</button>
		    </div>
			</div>
			{/*
				<hr/>
				<div className="text-center">
					All your data will be lost, if you delete account. <br/><br/>
					<button type="button" className="btn btn-danger btn-sm-app" onClick={e => deleteAccount(e)} disabled={btnDelete !== 'Delete Account'}>{btnDelete}</button>
				</div>
			*/}
	  </div>
	);
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindLoggedIn: (content) => dispatch(SetLoggedIn(content)),
		bindUser: (content) => dispatch(SetUser(content)),
		bindDbUser: (content) => dispatch(SetDbUser(content))
	}
}

export default connect(
	null,
	mapDispatchToProps
)(ProfileSettingsComponent);
