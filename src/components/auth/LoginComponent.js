import React, { useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { connect } from "react-redux";

import { signin } from 'firebase_config';
import { SetReload } from "store/actions";
import { StaticHeaderComponent } from "components";

const LoginComponent = ({bindReload}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
	const [btnSave, setBtnSave] = useState("Submit");
  const [error, setErrors] = useState("");
  const [eyeIcon, setEyeIcon] = useState("fa-eye");
  const history = useHistory();
  const routes = [];

	const handleKeyDown =(event) => {
		if (event.keyCode === 13) {
			handleForm(event);
		}
	}

  const handleForm = async (e) => {
    e.preventDefault();

    setBtnSave("Submitting...");
    let result = await signin({email, password});
    setBtnSave("Submit");
    if (result.status !== 200) {
    	setErrors(result.message);
    	return;
    } 
    bindReload(true);
  	history.push("/app/home");
  };

  const showPassword = () => {
  	let input = document.getElementById("loginPass");
  	if (input.type === "password") {
  		setEyeIcon("fa-eye-slash");
  		input.type = "text";
  	} else {
  		setEyeIcon("fa-eye");
  		input.type = "password"
  	}
  }

/*
 	const signInWithGoogle = async () => {
	  let result = await googleSignin();
	  if (result.status !== 200) {
	  	setErrors(result.message);
	  	return;
	  } 
	  bindReload(true);
		history.push("/app/home");
	}
*/
  return (
    <div className="App" onKeyDown={e => handleKeyDown(e)}>
    	<StaticHeaderComponent routes={routes} />
    	<div className="row login-form">
	    	<div className="mt-5 pt-3 col-xs-12 col-md-6">
	      	<div className="d-flex align-items-center mb-3">
	      		<div className="flex-grow-1">
	      			<h5>Login</h5>
						</div>
			    	<Link to="/bot_login" className="font-small">
			    		Try Gtok bot to login
			    	</Link>
			    </div>
		      <div>
			    	<div className="form-group">
			    		<label>Email</label>
			        <input
			          value={email}
			          onChange={e => setEmail(e.target.value)}
			          name="email"
			          type="email"
			          className="form-control"
			          placeholder="Enter email"
			          autoFocus={true}
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
			          id="loginPass"
			          placeholder="Enter password (must be atleast 6 letters)"
			        />
			    		<i className={`fa ${eyeIcon} show-password`} onClick={e => showPassword()}></i>
			    	</div>
		      	{error && <div className="text-danger fw-900"><br/><i className="fa fa-info-circle"></i>&nbsp;{error}</div>}
					  <button className="btn btn-submit btn-sm" disabled={btnSave !== 'Submit'} onClick={e => handleForm(e)}>{btnSave}</button>
						<div className="d-flex">
			        <Link to="/forgot_password" className="flex-grow-1">Forgot password</Link> <br/>
			        <Link to="/signup">New User? Signup</Link> <br/>
			      </div>
		      </div>
		    </div>
		    <div className="mt-5 pt-3 col-xs-12 col-md-6 login-page-clipart">
		    	<img src="assets/images/two_people_1_2.jpg" alt="Lets Gtok" className="col-8" />
		    	<div className="login-page-caption">Lets <span className="text-native">Gtok </span><br/> Share - Listen - Connect
		    	</div>
		    </div>
		  </div>
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

const mapDispatchToProps = (dispatch) => {
	return {
		bindReload: (content) => dispatch(SetReload(content))
	}
}

export default connect(
	null, 
	mapDispatchToProps
)(LoginComponent);