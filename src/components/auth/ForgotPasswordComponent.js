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

  return (
    <div>
    	<StaticHeaderComponent />
      <div className="login-form">
        <h4 className="page-header mb-4">Forgot password</h4>
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
        {
          result.status && <div className={`text-center mt-3 ${result.status === 200 ? "text-violet" : "text-danger"}`}>{result.message}</div>
		  	}
			  <button className="btn btn-sm btn-violet col-12 my-3" disabled={btnSave !== 'Send'} onClick={e => handleForm(e)}>{btnSave}</button>
        <div className="d-flex page-opts">
          <Link to="/login" className="flex-grow-1">Login</Link> <br/>
          <Link to="/signup">Signup</Link> <br/>
        </div>
    	</div>
    </div>
  );
};

export default ForgotPasswordComponent;
