import React from "react";
import { Link } from 'react-router-dom';

const HeaderComponent = (props) => (
  <nav className="navbar fixed-top navbar-expand-sm py-md-0">
    <Link to="/app/profile">
      <img src={require(`assets/svgs/LeftArrow.svg`)} className="go-back-icon" alt="LeftArrow" />
    </Link>
    <div className="navbar-brand mr-auto fs-16">
      Redeem badges
    </div>
    <ul className="navbar-nav ml-auto d-none">
      <li className="nav-item">
        <div className="nav-link p-0">
          <Link to="/app/settings/change_password" title="Permission" onClick={props.save}>
            <img src={require(`assets/svgs/Save.svg`)} className="save-icon" alt="Save" />
          </Link>
        </div>
      </li>
    </ul>
  </nav>
);

export default HeaderComponent;
