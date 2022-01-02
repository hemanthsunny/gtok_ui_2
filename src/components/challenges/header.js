import React from "react";
import { Link } from "react-router-dom";

const HeaderComponent = ({ newMessagesCount, newAlertsCount }) => {
  return (
    <nav className="navbar fixed-top navbar-expand-sm py-md-0">
      <div className="navbar-brand mr-auto">
        <Link to="/app/assets">
          {/* <img src={require(`assets/svgs/Home.svg`).default} className='home-icon' alt='Home' /> */}
          <span className="home-page-title">Lets Gtok</span>
        </Link>
      </div>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item" title="Profile">
          <div className="nav-link p-0">
            <Link
              to="/app/chats"
              title="Messages"
              style={{ position: "relative" }}
            >
              <img
                src={require("assets/svgs/Messages.svg").default}
                className="message-icon"
                alt="Messages"
              />
              {newMessagesCount > 0 && (
                <sup className="message-count-dot">
                  <img
                    src={require("assets/svgs/DotActive.svg").default}
                    className={"dot-icon"}
                    alt="Dot"
                  />
                </sup>
              )}
            </Link>
            <Link
              to="/app/alerts"
              title="Alerts"
              style={{ position: "relative" }}
            >
              <img
                src={require("assets/svgs/Bell.svg").default}
                className="alert-icon"
                alt="Alerts"
              />
              {newAlertsCount > 0 && (
                <sup className="alert-count-dot">
                  <img
                    src={require("assets/svgs/DotActive.svg").default}
                    className={"dot-icon"}
                    alt="Dot"
                  />
                </sup>
              )}
            </Link>
            <Link to="/app/profile" title="Profile">
              <img
                src={require("assets/svgs/Profile.svg").default}
                className="profile-icon"
                alt="Profile"
              />
            </Link>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default HeaderComponent;
