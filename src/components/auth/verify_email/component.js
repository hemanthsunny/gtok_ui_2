import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";

import { SetUser, SetLoggedIn, SetDbUser } from "store/actions";
import { update, verifyEmail, signout } from "firebase_config";
import { HeaderComponent } from "components";

const EmailVerifyComponent = ({
  currentUser,
  bindLoggedIn,
  bindDbUser,
  bindUser,
}) => {
  const [resendEmail, setResendEmail] = useState("Resend verification email");
  const [btnSignout, setBtnSignout] = useState("Logout");
  const [emailSentTime, setEmailSentTime] = useState(
    currentUser.verifyEmailSentTime
  );
  const history = useHistory();

  const sendEmail = async () => {
    setResendEmail("Email sending...");
    const data = { verifyEmailSentTime: new Date() };
    await verifyEmail();
    await update("users", currentUser.id, data);
    setEmailSentTime(new Date());
    setResendEmail("Email sent");
  };

  const isEmailSent = () => {
    if (emailSentTime) {
      const now = moment(new Date());
      const end = moment(emailSentTime);
      if (now.diff(end, "hours") < 12) {
        return true;
      }
    }
    return false;
  };

  const signoutUser = async () => {
    setBtnSignout("Working...");
    await signout();
    await bindLoggedIn(false);
    await bindDbUser(null);
    await bindUser(null);
    history.push("/logout");
  };

  const adminUser = async () => {
    await update("users", currentUser.id, { admin: true });
    window.location.reload();
  };

  return (
    <div className="verify-email" id="verify_email">
      <HeaderComponent />
      <div className="container login-form text-center pt-5 mt-5">
        <h5 className="page-header">
          Please verify your email before you continue.
        </h5>
        <div className="mt-5 pt-3 text-secondary">
          <button
            className="btn btn-violet-outline btn-sm col-12"
            onClick={(e) => sendEmail(e)}
            disabled={isEmailSent()}
          >
            {resendEmail}
          </button>
          <button
            className="btn btn-sm btn-outline-secondary my-3 col-12"
            disabled={btnSignout !== "Logout"}
            onClick={signoutUser}
          >
            {btnSignout}
          </button>
          {process.env.REACT_APP_ENV === "development" && (
            <button
              className="btn btn-violet-outline btn-sm col-12"
              onClick={adminUser}
            >
              I'm an administrator. Request me access.
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    bindLoggedIn: (content) => dispatch(SetLoggedIn(content)),
    bindUser: (content) => dispatch(SetUser(content)),
    bindDbUser: (content) => dispatch(SetDbUser(content)),
  };
};

export default connect(null, mapDispatchToProps)(EmailVerifyComponent);
