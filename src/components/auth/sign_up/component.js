import React, { useState } from "react";
import { Link, useHistory, withRouter } from "react-router-dom";

import { signup, add, getQuery, firestore } from "firebase_config";
import { StaticHeaderComponent } from "components";
import { validateEmail } from "helpers";
import "./style.css";

const SignupComponent = (props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tnc, setTnc] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [btnSave, setBtnSave] = useState("Submit");
  const [error, setErrors] = useState("");
  const [eyeIcon, setEyeIcon] = useState("fa-eye");
  const history = useHistory();
  const inviteeUsername = props.match.params.username;

  const handleForm = async (e) => {
    setErrors("");
    e.preventDefault();
    if (!username || !username.trim()) {
      setErrors("Username is mandatory");
      return null;
    }
    if (username && !username.match("^[a-z 0-9 _]+$")) {
      setErrors("Only alphanumeric values are accepted as username");
      return null;
    }

    const data = {
      username: username.toLowerCase().replace(/ /g, "_"),
      displayName: username.toLowerCase().replace(/_/g, " "),
    };
    // Verify username in database
    const user = await getQuery(
      firestore.collection("users").where("username", "==", data.username).get()
    );
    if (user[0]) {
      setErrors("Username is already in use. Attempt anything new.");
      return null;
    }
    if (!email || !email.trim()) {
      setErrors("Email is mandatory");
      return null;
    }
    if (email && !validateEmail(email)) {
      setErrors("Enter a valid email");
      return null;
    }
    if (!password || !password.trim()) {
      setErrors("Password is mandatory");
      return null;
    }
    if (!tnc) {
      setErrors("Agree to our Terms and conditions");
      return null;
    }
    setBtnSave("Submitting...");
    const res = await signup({ email, password, data });
    if (res && res.status !== 200) {
      setErrors(res.message);
      setBtnSave("Submit");
      return null;
    }
    const userData = {
      email,
      followers: [],
      username: data.username,
      displayName: data.displayName,
      permissions: {
        tnc,
        recordPageVisits: true,
        locationAccess: true,
        emailUpdates,
      },
      photoURL: null,
      verifyEmailSentTime: new Date(),
    };
    const createDbUser = await add("users", userData);

    if (inviteeUsername) {
      /* Invited by a user */
      await add("referals", {
        username: data.username,
        invitedBy: inviteeUsername,
      });
    }
    setBtnSave("Submit");
    if (createDbUser.status !== 200) {
      setErrors(createDbUser.message);
      return null;
    }
    history.replace("/");
  };

  const showPassword = () => {
    const input = document.getElementById("signupPass");
    if (input.type === "password") {
      setEyeIcon("fa-eye-slash");
      input.type = "text";
    } else {
      setEyeIcon("fa-eye");
      input.type = "password";
    }
  };

  const redirectTo = () => {
    window.open("https://letsgtok.com", "_blank");
  };

  return (
    <div className="signup-page" id="signup">
      <StaticHeaderComponent />
      <div className="container login-form">
        <div className="row">
          <div className="col-12 order-2 order-md-1 col-sm-6 left-block">
            <div className="header">
              <h1>Join the community</h1>
              <div className="subheader">
                Feelings are being shared from all over the world.
              </div>
            </div>
            <div className="col-12 center-wrapper d-none d-sm-block">
              <div className="media option">
                <div className="icon">
                  <img
                    src={require("assets/svgs/signup/feelings.svg").default}
                    alt="Feelings"
                  />
                </div>
                <div className="media-body option-text">
                  Share your feelings
                </div>
              </div>
              <div className="media option">
                <div className="icon">
                  <img
                    src={require("assets/svgs/signup/activities.svg").default}
                    alt="Activities"
                  />
                </div>
                <div className="media-body option-text">
                  Post your activities
                </div>
              </div>
              <div className="media option">
                <div className="icon">
                  <img
                    src={require("assets/svgs/signup/earn.svg").default}
                    alt="Earn"
                  />
                </div>
                <div className="media-body option-text">Earn</div>
              </div>
            </div>
            <div className="center-wrapper d-sm-none">
              <div className="row option">
                <div className="icon">
                  <img
                    src={require("assets/svgs/signup/feelings.svg").default}
                    alt="Feelings"
                  />
                </div>
                <div className="col-12 mt-3 mb-5 option-text">
                  Share your feelings
                </div>
                <div className="icon">
                  <img
                    src={require("assets/svgs/signup/activities.svg").default}
                    alt="Feelings"
                  />
                </div>
                <div className="col-12 mt-3 mb-5 option-text">
                  Post your activities
                </div>
                <div className="icon">
                  <img
                    src={require("assets/svgs/signup/earn.svg").default}
                    alt="Feelings"
                  />
                </div>
                <div className="col-12 mt-3 mb-5 option-text">Earn</div>
              </div>
            </div>
            <div className="col-12 mt-3 pl-0 pb-5 mb-5 pb-sm-0 mb-sm-0">
              <img
                src={require("assets/svgs/login/left_learn_more.svg").default}
                className="learn-more pointer"
                alt="Learn more"
                onClick={redirectTo}
              />
            </div>
          </div>
          <div className="col-12 order-1 order-md-2 col-sm-6 right-block">
            <div className="header text-center">
              <img
                src={require("assets/svgs/signup/right_header.svg").default}
                className="header"
                alt="Header"
              />
            </div>
            <div className="body">
              <div className="input-group mb-2">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon3">
                    <div>
                      <img
                        src={
                          require("assets/svgs/signup/right_username_icon.svg")
                            .default
                        }
                        alt="User"
                      />
                    </div>
                  </span>
                </div>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  autoFocus={true}
                  aria-label="username"
                  aria-describedby="basic-addon3"
                />
              </div>
              <div className="input-group mb-2">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">
                    <div>
                      <img
                        className="mail-icon"
                        src={
                          require("assets/svgs/login/right_mail_icon.svg")
                            .default
                        }
                        alt="Mail"
                      />
                    </div>
                  </span>
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  autoFocus={true}
                  aria-label="email"
                  aria-describedby="basic-addon1"
                />
              </div>
              <div className="input-group mb-2">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon2">
                    <div>
                      <img
                        src={
                          require("assets/svgs/login/right_lock_icon.svg")
                            .default
                        }
                        alt="Lock"
                      />
                    </div>
                  </span>
                </div>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  value={password}
                  type="password"
                  className="form-control"
                  id="signupPass"
                  placeholder="Password (atleast 6 letters required)"
                  aria-label="password"
                  aria-describedby="basic-addon2"
                />
                <div className="input-group-append">
                  <span
                    className="input-group-text append"
                    id="basic-addon3"
                    onClick={(e) => showPassword()}
                  >
                    {eyeIcon === "fa-eye" ? (
                      <img
                        className="show-password"
                        src={require("assets/svgs/Eye.svg").default}
                        alt="Eye"
                      />
                    ) : (
                      <img
                        className="show-password"
                        src={require("assets/svgs/EyeOpen.svg").default}
                        alt="EyeOpen"
                      />
                    )}
                  </span>
                </div>
              </div>
              <div className="options pt-2">
                <div className="d-flex form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="tnc"
                    name="tnc"
                    onChange={(e) => setTnc(!tnc)}
                    checked={tnc}
                  />
                  <label className="form-check-label" htmlFor="tnc">
                    I'm at least 16 years old. Accept our{" "}
                    <a
                      href="https://letsgtok.com/tnc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet"
                    >
                      Terms of service
                    </a>
                    , and our{" "}
                    <a
                      href="https://letsgtok.com/privacy_policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet"
                    >
                      Privacy policy
                    </a>
                    .
                  </label>
                </div>
                <div className="d-flex form-check mt-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="emailUpdates"
                    name="emailUpdates"
                    onChange={(e) => setEmailUpdates(!emailUpdates)}
                    checked={emailUpdates}
                  />
                  <label className="form-check-label" htmlFor="emailUpdates">
                    I'd like to be notified by email.
                  </label>
                </div>
              </div>
              {error && (
                <div className="text-danger text-center mt-3">{error}</div>
              )}
              <div>
                <button
                  className="btn login-btn col-12"
                  disabled={btnSave !== "Submit"}
                  onClick={(e) => handleForm(e)}
                >
                  {btnSave}
                </button>
                <br />
                <Link to="/login" className="signup-btn">
                  Already a user? Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="d-flex justify-content-around">
            <div className="pointer" onClick={redirectTo}>
              About us
            </div>
            <div className="pointer" onClick={redirectTo}>
              Blogs
            </div>
            <div className="pointer" onClick={redirectTo}>
              Contact
            </div>
          </div>
          <div className="company-name">Lets Gtok Limited &copy;</div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(SignupComponent);
