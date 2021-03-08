import React from "react";
import { Link } from 'react-router-dom';

import { CustomImageComponent } from "components";

const SidebarComponent = ({ currentUser }) => {
  return (window.innerWidth >= 576) && (
    <div className="sidebar">
	  	<nav className="header">
        <Link to="/app/profile" className="nav-link">
          <div className="media">
            <CustomImageComponent user={currentUser} size="lg" />
            <div className="media-body static-text">
              {currentUser.displayName}
              <img src={require(`assets/svgs/AngleRight.svg`).default} alt="Edit" />
              <div className="caption">View profile</div>
            </div>
          </div>
        </Link>
        <Link to="/app/create_post" className="nav-link -sm">
          <img src={require(`assets/svgs/Plus.svg`).default} className="static-avatar" alt="Edit" />
          <div className="static-text">
            Create Post
          </div>
				</Link>
      </nav>
    </div>
  )
};

export default SidebarComponent;
