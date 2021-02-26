import React, { useState } from "react";
import { Link } from 'react-router-dom';

import { StaticHeaderComponent } from "components";
import { sendForgotPassword } from 'firebase_config';

const ForgotPasswordComponent = () => {
  const [email, setEmail] = useState("");
	const [btnSave, setBtnSave] = useState("Send");
  const [result, setResult] = useState({});

  const handleForm = async (e) => {
    e.preventDefault();
    setBtnSave("Sending...");
    let res = await sendForgotPassword(email);
  	setResult(res);
  	if (res.status === 200) setBtnSave("Sent");
  	else setBtnSave("Send");
  };

  const renderSuccessNotification = () => (
  	<div>
  		<div className="h3 text-success"><i className="fa fa-check-circle"></i></div>
      <h5 className="text-center text-secondary">Your forgot password email sent successfully.</h5>
  	</div>
  );

  const renderFailNotification = () => (
  	<div>
  		<div className="h3 text-danger"><i className="fa fa-times-circle"></i></div>
      <h5 className="text-center text-secondary">Something went wrong. Try again later.</h5>
  	</div>
  );
    
  const renderForm = () => (
  	<div>
      <h4>Forgot password</h4>
      <div className="form">
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          name="email"
          type="email"
          className="form-input"
          placeholder="Enter email"
        />
        <br />
			  <div className="text-center">
				  <button className="btn btn-secondary btn-sm" disabled={btnSave !== 'Send'} onClick={e => handleForm(e)}>{btnSave}</button>
				 </div>
      </div>
  	</div>
  );

  return (
    <div className="App">
    	<StaticHeaderComponent />
    	<div className="mt-5 pt-3">
		  	{
		  		result.status ? (result.status === 200 ? renderSuccessNotification() : renderFailNotification()) : renderForm()
		  	}
				<br/>
        <Link to="/login">&#8592; Go back</Link>
	    </div>
      <br/>
    {/*
      <button onClick={() => signInWithGoogle()} className="googleBtn" type="button">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="logo"
        />
        Login With Google
      </button>
    */}
    </div>
  );
};

export default ForgotPasswordComponent;