import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const HeaderComponent = ({
  newMessagesCount,
  newAlertsCount,
  pendingRelationsCount,
  save,
  loading,
}) => {
  return (
    <nav className="navbar fixed-top fixed-top-lg navbar-violet-md px-4">
      <Link to="/app/settings">
        <img
          src={require("assets/svgs/Cross.svg").default}
          className="cross-icon"
          alt="LeftArrow"
        />
      </Link>
      <div className="navbar-brand mr-auto pt-2">
        &nbsp; &nbsp; Change password
      </div>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <div className="nav-link p-0 text-white fw-500" onClick={save}>
            {loading ? <i className="fa fa-spinner fa-spin"></i> : "Update"}
          </div>
        </li>
      </ul>
    </nav>
  );
};

const mapStateToProps = (state) => {
  const { newAlertsCount } = state.alerts;
  const { newMessagesCount } = state.chatMessages;
  const { pendingRelationsCount } = state.relationships;
  return { newAlertsCount, newMessagesCount, pendingRelationsCount };
};

export default connect(mapStateToProps, null)(HeaderComponent);
