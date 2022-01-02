import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import "./style.css";

import HeaderComponent from "./header";
import { SetDbUser } from "store/actions";
import { get, timestamp, batchWrite } from "firebase_config";
import { capitalizeFirstLetter } from "helpers";

function SendCompanyAlertsComponent({ currentUser }) {
  const [actionLink, setActionLink] = useState("");
  const [alertText, setAlertText] = useState("");
  const alertImage =
    "https://storage.googleapis.com/lg-main.appspot.com/images/favicon.png";
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const sendAlerts = async () => {
    if (!alertText) {
      toast.error("Alert text is mandatory");
      return null;
    }
    if (actionLink && !actionLink.startsWith("/app/")) {
      toast.error("Action link does not exist");
      return null;
    }
    if (
      window.confirm("Are you sure you want to send this alert to all users?")
    ) {
      setLoading(true);
      /* Send alerts to all users */
      const allUsers = await get("users");
      const userIds = allUsers.map((u) => u.id);

      const result = await batchWrite("logs", userIds, {
        text: alertText,
        photoURL: alertImage,
        userId: currentUser.id,
        actionLink: actionLink,
        unread: true,
        timestamp,
      });
      if (result.status === 200) {
        toast.success("Alert sent successfully!");
        history.push("/app/settings");
      } else {
        toast.error("Something went wrong. Try again later!");
      }
      setLoading(false);
    }
  };

  return (
    <div>
      <HeaderComponent save={sendAlerts} loading={loading} />
      <div>
        <div className="dashboard-content">
          <div className="send-alerts-wrapper mt-sm-5">
            <div className="form-group">
              <label htmlFor="alertText" className="form-label">
                Alert text <span className="text-violet">*</span>
              </label>
              <div className="">
                <textarea
                  className="form-control"
                  id="alertText"
                  placeholder="Type alert text here"
                  value={alertText}
                  onChange={(e) => setAlertText(e.target.value)}
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="actionLink" className="form-label">
                Action link
              </label>
              <div className="">
                <input
                  type="text"
                  className="form-control"
                  id="actionLink"
                  value={actionLink}
                  placeholder="Eg: /app/assets"
                  onChange={(e) => setActionLink(e.target.value)}
                />
              </div>
            </div>
            {alertText && (
              <div className="form-group">
                <label htmlFor="alertPreview" className="form-label">
                  Alert preview
                </label>
                <div className="media py-2" id="alertPreview">
                  <img
                    src={alertImage}
                    alt="@letsgtok"
                    className="custom-image"
                  />
                  <sup className="alert-dot">
                    <img
                      src={require("assets/svgs/DotActive.svg").default}
                      className="dot-chat-icon"
                      alt="Dot"
                    />
                  </sup>
                  <div className="media-body pl-2 font-xs-small">
                    <span className={`${alert.unread && "fw-500"}`}>
                      {capitalizeFirstLetter(alertText)}
                    </span>
                    <div className="created-at">{moment().fromNow()}</div>
                  </div>
                </div>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Note:</label>
              <div className="">
                <ul>
                  <li>This alert sends to all users registered in app.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { user } = state.authUsers;
  return { user };
};

const mapDispatchToProps = (dispatch) => {
  return {
    bindDbUser: (content) => dispatch(SetDbUser(content)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendCompanyAlertsComponent);
