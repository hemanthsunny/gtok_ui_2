import React, { useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import moment from "moment";

import { signup, add } from "firebase_config";
import { StaticHeaderComponent } from "components";
import { validateEmail } from "helpers";

const SignupComponent = () => {
  const [ name, setName ] = useState("");
  const [ dob, setDob ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ cpassword, setCpassword ] = useState("");
  // const [tnc, setTnc] = useState(false);
  const [ emailUpdates, setEmailUpdates ] = useState(true);
	const [ btnSave, setBtnSave ] = useState("Submit");
  const [ error, setErrors ] = useState("");
  const [eyeIcon, setEyeIcon] = useState("fa-eye");
  const history = useHistory();

  const handleForm = async (e) => {
    e.preventDefault();
    if (!name || !name.trim()) {
    	setErrors("Name is mandatory");
    	return;
    }
    if (!dob) {
    	setErrors("Date of Birth is mandatory");
    	return;
    }
    if (dob && (moment().diff(dob, 'years', false) < 18)) {
    	setErrors("You must be 18 years old to proceed");
    	return;
    }
    if (!email || !email.trim()) {
    	setErrors("Email is mandatory");
    	return;
    }
    if (email && !validateEmail(email)) {
    	setErrors("Enter a valid email");
    	return;
    }
    if (!password || !password.trim()) {
    	setErrors("Password is mandatory");
    	return;
    }
    if (!cpassword || !cpassword.trim()) {
    	setErrors("Re-enter your password");
    	return;
    }
    if (password !== cpassword) {
    	setErrors("Password & Re-enter password must match");
    	return;
    }
    // if (!tnc) {
    // 	setErrors("Agree to our Terms and conditions");
    // 	return;
    // }
    let data = {
    	name: name.toLowerCase(),
    	dob,
    	emailUpdates
    }
    setBtnSave("Submitting...");
    await signup({email, password, data});
    let userData = {
  		email,
  		followers: [],
  		displayName: name.toLowerCase(),
  		dob,
  		permissions: {
  			tnc: true,
  			recordPageVisits: true,
  			locationAccess: true,
  			emailUpdates
  		},
  		photoURL: null,
  		verifyEmailSentTime: new Date()
    }
    let createDbUser = await add("users", userData);
    setBtnSave("Submit");
    if (createDbUser.status !== 200) {
    	setErrors(createDbUser.message);
    	return;
    }
  	history.push("/");
  };

  const showPassword = () => {
  	let input = document.getElementById("signupPass");
  	if (input.type === "password") {
  		setEyeIcon("fa-eye-slash");
  		input.type = "text";
  	} else {
  		setEyeIcon("fa-eye");
  		input.type = "password"
  	}
  }

	/*
  const handleGoogleLogin = async () => {
    let result = await googleSignup();
    if (result.status !== 200) {
    	setErrors(result.message);
    	return;
    } 
    Auth.setLoggedIn(true)
  	history.push("/app/home");
  }*/

  return (
    <div className="container">
    	<StaticHeaderComponent />
    	<div className="mt-5 pt-5">
    		<div className="signup-form mb-3">
			    <h5>Signup</h5>
			    <div className="text-secondary">Lets Gtok is in Beta stage. As a Beta app user, you can use our app with limited features.</div>
			  </div>
	      <div className="signup-form">
		    	<div className="form-group">
		    		<label>Name</label>
		        <input
		          value={name}
		          onChange={e => setName(e.target.value)}
		          name="name"
		          type="text"
		          className="form-control"
		          placeholder="Enter your name"
		        />
		    	</div>
		    	<div className="form-group">
		    		<label>Date of birth</label>
		        <input
		          onChange={e => setDob(e.target.value)}
		          name="dob"
		          value={dob}
		          type="date"
		          className="form-control"
		          placeholder="Date of birth"
		          max="2003-01-01"
		        />
		    	</div>
		    	<div className="form-group">
		    		<label>Email</label>
		        <input
		          value={email}
		          onChange={e => setEmail(e.target.value)}
		          name="email"
		          type="email"
		          className="form-control"
		          placeholder="Enter email"
		        />
		    	</div>
		    	<div className="form-group input-password">
		    		<label>Password</label>
		        <input
		          onChange={e => setPassword(e.target.value)}
		          name="password"
		          value={password}
		          type="password"
		          className="form-control"
		          id="signupPass"
		          placeholder="Enter password (must be atleast 6 letters)"
		        />
		    		<i className={`fa ${eyeIcon} show-password`} onClick={e => showPassword()}></i>
		    	</div>
		    	<div className="form-group">
		    		<label>Re-enter Password</label>
		        <input
		          onChange={e => setCpassword(e.target.value)}
		          name="cpassword"
		          value={cpassword}
		          type="password"
		          className="form-control"
		          placeholder="Re-enter password"
		        />
		    	</div>
	      {/*
					<div className="d-flex">
						<div className="custom-switch mb-2">
						  <input type="checkbox" className="custom-control-input" id="tnc" name="tnc" onChange={e => setTnc(!tnc)} checked={tnc} />
						  <label className="custom-control-label text-left" htmlFor="tnc">
						  	<small>Agree to our Terms and Conditions.</small>
						  </label>
						</div>
					</div>
				*/}
					<div className="d-flex align-items-center">
						<div className="custom-switch mb-2">
						  <input type="checkbox" className="custom-control-input" id="emailUpdates" name="emailUpdates" onChange={e => setEmailUpdates(!emailUpdates)} checked={emailUpdates} />
						  <label className="custom-control-label" htmlFor="emailUpdates">
						  	Would like to get email notifications.
						  </label>
						</div>
					</div>
	      	{error && <div className="text-danger fw-900"><br/><i className="fa fa-info-circle"></i>&nbsp;{error}</div>}
	      	<div className="d-flex align-items-center">
	      		<div className="flex-grow-1">
						  <button className="btn btn-submit btn-sm" disabled={btnSave !== 'Submit'} onClick={e => handleForm(e)}>{btnSave}</button>
						</div>
		        <Link to="/login">Existing User? Login</Link>
		      </div>
	      </div>
	    </div>
    <br/>
    {/*
      <button onClick={() => handleGoogleLogin()} class="googleBtn" type="button">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="logo"
        />
        Join With Google
      </button>
    */}
    </div>
  );
};

export default SignupComponent;
