import React from "react";
import { Link } from 'react-router-dom';

const HeaderComponent = ({userId}) => {
  return (
    <nav className="navbar fixed-top navbar-expand-sm py-md-0">
      <Link to={`/app/profile/${userId}`}>
        <img src={require(`assets/svgs/LeftArrow.svg`)} className="go-back-icon" alt="LeftArrow" />
      </Link>
      <div className="navbar-brand mr-auto fs-16 text-capitalize">
        Posts
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
