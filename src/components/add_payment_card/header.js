import React from "react";
import { Link } from "react-router-dom";

const HeaderComponent = (props) => (
  <nav className="navbar fixed-top navbar-expand-sm py-md-0">
    <Link to="/app/settings/payment_cards">
      <img
        src={require("assets/svgs/LeftArrow.svg").default}
        className="go-back-icon"
        alt="LeftArrow"
      />
    </Link>
    <div className="navbar-brand mr-auto fs-16">Add new card</div>
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <div className="nav-link p-0">
          <div className="btn btn-link" title="Permission" onClick={props.save}>
            <img
              src={require("assets/svgs/Save.svg").default}
              className="save-icon"
              alt="Save"
            />
          </div>
        </div>
      </li>
    </ul>
  </nav>
);

export default HeaderComponent;
