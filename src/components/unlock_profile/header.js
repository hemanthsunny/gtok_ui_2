import React from "react";
import { Link } from 'react-router-dom';

const HeaderComponent = ({user, currentUserId}) => {
  return (
    <nav className="navbar fixed-top navbar-expand-sm py-md-0">
      <Link to={`/app/profile/${user.id}`}>
        <img src={require(`assets/svgs/LeftArrow.svg`)} className="go-back-icon" alt="LeftArrow" />
      </Link>
      <div className="navbar-brand mr-auto fs-16 text-capitalize">
        Unlock {user.displayName} profile
      </div>
      <ul className="navbar-nav ml-auto d-none">
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

export default HeaderComponent;
