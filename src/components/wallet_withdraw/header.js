import React from "react";
import { Link } from "react-router-dom";

const HeaderComponent = ({ save, loading }) => {
  return (
    <nav className="navbar fixed-top fixed-top-lg navbar-gradient-md">
      <div className="container">
        <Link to="/app/wallet">
          <img
            src={require("assets/svgs/LeftArrowWhite.svg").default}
            className="go-back-icon"
            alt="LeftArrow"
          />
        </Link>
        <div className="navbar-brand mx-auto pt-2">Withdraw</div>
        <ul className="navbar-nav ml-auto d-none">
          <li className="nav-item">
            <div className="nav-link p-0 text-white fw-500">
              {loading ? <i className="fa fa-spinner fa-spin"></i> : "Save"}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default HeaderComponent;
