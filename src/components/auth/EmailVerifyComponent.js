import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import moment from "moment";

import { SetUser, SetLoggedIn, SetDbUser } from "store/actions";
import { update, verifyEmail, signout } from "firebase_config";

const EmailVerifyComponent = ({currentUser, bindLoggedIn, bindDbUser, bindUser}) => {
	const [ resendEmail, setResendEmail ] = useState("Resend verification email");
	const [ btnSignout, setBtnSignout ] = useState('Logout');
	const [ emailSentTime, setEmailSentTime ] = useState(currentUser.verifyEmailSentTime);
  const history = useHistory();
	
	const sendEmail = async () => {
		setResendEmail("Email sending...");
		let data = { verifyEmailSentTime: new Date() }
		await verifyEmail();
		await update("users", currentUser.id, data);
		setEmailSentTime(new Date());
		setResendEmail("Email sent");
	}

	const isEmailSent = () => {
		if (emailSentTime) {
			let now = moment(new Date());
			let end = moment(emailSentTime);
			if (now.diff(end, 'hours') < 12) {
				return true
			}
		}
		return false;
	}

  const signoutUser = async () => {
  	setBtnSignout("Working...");
  	await signout();
  	await bindLoggedIn(false);
    await bindDbUser(null);
  	await bindUser(null);
  	history.push("/logout");
  }

	return (
	  <div className="App">
	  	<div className="mt-5 pt-3 text-secondary">
	      <h5 className="text-center text-secondary mb-3">
		      Please verify your email before you continue.
	      </h5><br/>
	      <small>If you didn't receive an email, you can try resend.</small><br/>
	    	<button className="btn btn-outline-secondary btn-sm" onClick={e => sendEmail(e)} disabled={isEmailSent()}>
	    		{resendEmail}
	    	</button>
			  <button className="btn btn-sm btn-danger ml-2 font-xs-small" disabled={btnSignout !== 'Logout'} onClick={signoutUser}>{btnSignout}</button>
	    </div>
	  </div>
  );
};

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
)(EmailVerifyComponent);