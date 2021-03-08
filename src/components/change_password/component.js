import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";

import HeaderComponent from "./header";
import { SidebarComponent } from "components";
import { changePassword } from "firebase_config";

function ChangePasswordComponent({currentUser, newMessagesCount, newAlertsCount}) {
  const [ eyeIcon, setEyeIcon ] = useState("hide");
  const [ newPassword, setNewPassword ] = useState("");
  const [ confirmNewPassword, setConfirmNewPassword ] = useState("");
	const [ result, setResult ] = useState({});

  const showPassword = () => {
  	let input = document.getElementById("newPass");
    let confirmInput = document.getElementById("confirmNewPass");
  	if (input.type === "password") {
  		setEyeIcon("show");
  		input.type = "text";
      confirmInput.type = "text";
  	} else {
  		setEyeIcon("hide");
  		input.type = "password"
      confirmInput.type = "password"
  	}
  }

  const updatePassword = async () => {
  	if (newPassword !== confirmNewPassword) {
  		alert("Passwords donot match");
  		return null;
  	}
  	let res = await changePassword(newPassword);
    setResult(res);
		await setNewPassword(null);
		await setConfirmNewPassword(null);
    setTimeout(() => {
      setResult("");
    }, 3000);
  }

  const subHeader = () => (
    <div className="dashboard-tabs -xs-d-none" role="navigation" aria-label="Main">
			<div className="tabs -big">
        <Link to="/app/settings" className="tab-item">Back</Link>
				<div className="tab-item -active">Update password</div>
			</div>
		</div>
  );

	return (
    <div>
      <HeaderComponent newMessagesCount={newMessagesCount} newAlertsCount={newAlertsCount}/>
      <div>
        <SidebarComponent currentUser={currentUser} />
        <div className="dashboard-content -xs-bg-none">
          {subHeader()}
      	  <div className="container change-pw-wrapper desktop-align-center">
            <div className="form-group">
              <label>New Password</label>
              <input type="password" className="form-control" id="newPass" onChange={e => setNewPassword(e.target.value)} placeholder="New password"/>
              <img src={(eyeIcon === "hide") ? require(`assets/svgs/VisibilityOff.svg`).default : require(`assets/svgs/VisibilityOn.svg`).default} className="pw-visibility-icon" alt="Visibility"  onClick={e => showPassword()} />
            </div>
            <div className="form-group">
              <label>Repeat New Password</label>
              <input type="password" className="form-control" id="confirmNewPass" onChange={e => setConfirmNewPassword(e.target.value)} placeholder="Confirm new password"/>
            </div>
            <button className="btn btn-sm btn-violet col-12" onClick={updatePassword}>Update</button>
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
  const { newAlertsCount } = state.alerts;
	const { newMessagesCount } = state.chatMessages;
	return { newAlertsCount, newMessagesCount };
}

export default connect(mapStateToProps, null)(ChangePasswordComponent);
