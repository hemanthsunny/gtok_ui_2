import React from "react";
import { Link } from 'react-router-dom';

const HeaderComponent = (props) => (
  <nav className="navbar fixed-top navbar-expand-sm py-md-0">
    <Link to="/app/profile">
      <img src={require(`assets/svgs/LeftArrow.svg`)} className="go-back-icon" alt="LeftArrow" />
    </Link>
    <div className="navbar-brand mr-auto fs-18">
      Settings
    </div>
    <ul className="navbar-nav ml-auto d-none">
      <li className="nav-item">
        <div className="nav-link p-0">
          <Link to="/app/profile" title="Alert Settings">
            <img src={require(`assets/svgs/VerticalMenuDots.svg`)} className="go-back-icon" alt="Menu" />
          </Link>
        </div>
      </li>
    </ul>
  </nav>
);

export default HeaderComponent;
