import React from "react";

const HeaderComponent = ({ save, loading, goBack }) => {
  return (
    <nav className="navbar fixed-top fixed-top-lg navbar-gradient-md">
      <div className="container pl-0">
        <button className="btn btn-link p-0" onClick={goBack}>
          <img
            src={require("assets/svgs/LeftArrowWhite.svg").default}
            className="go-back-icon"
            alt="LeftArrow"
          />
        </button>
        <div className="navbar-brand mx-auto pt-2">Recharge</div>
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
