import React from "react";
import { Link } from 'react-router-dom';

const ProfileHeaderComponent = ({username}) => {
  return (
    <nav className="navbar fixed-top navbar-expand-sm py-md-0">
      <Link to="/app/posts">
        <img src={require(`assets/svgs/LeftArrow.svg`)} className="go-back-icon" alt="LeftArrow" />
      </Link>
      <div className="navbar-brand mr-auto fs-18 text-capitalize">
        {username}
      </div>
      <ul className="navbar-nav ml-auto">
        <li className="">
          <div className="nav-link p-0">
            <Link to="/app/settings" title="Settings">
              <img src={require(`assets/svgs/Settings.svg`)} className="settings-icon" alt="Settings" />
            </Link>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default ProfileHeaderComponent;
