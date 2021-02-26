import React, { useState } from "react";
import HeaderComponent from "./header";
import { changePassword } from "firebase_config";

function ChangePasswordComponent({currentUser}) {
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
  }

	return (
    <div>
      <HeaderComponent save={updatePassword} />
  	  <div className="container change-pw-wrapper">
        <div className="form-group">
          <label>New Password</label>
          <input type="password" className="form-control" id="newPass" onChange={e => setNewPassword(e.target.value)} placeholder="New password"/>
          <img src={(eyeIcon === "hide") ? require(`assets/svgs/VisibilityOff.svg`) : require(`assets/svgs/VisibilityOn.svg`)} className="pw-visibility-icon" alt="Visibility"  onClick={e => showPassword()} />
        </div>
        <div className="form-group">
          <label>Repeat New Password</label>
          <input type="password" className="form-control" id="confirmNewPass" onChange={e => setConfirmNewPassword(e.target.value)} placeholder="Confirm new password"/>
        </div>
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
	);
}

export default ChangePasswordComponent;
