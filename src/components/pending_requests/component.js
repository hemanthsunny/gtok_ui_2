import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import "./style.css";

import HeaderComponent from "./header";
import UserComponent from "./user/component";
import { SetAllUsers } from "store/actions";

const ParentComponent = ({
  currentUser,
  allUsers,
  bindAllUsers,
  relations,
  pendingRelationsCount,
}) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // if (!allUsers[0]) {
    bindAllUsers(currentUser, "all");
    // }
    if (relations[0]) {
      // status must be 0
      const rlns = relations.filter(
        (rln) => rln.userIdTwo === currentUser.id && rln.status === 0
      );
      const uIds = _.map(rlns, "userIdOne");
      setUsers(_.filter(allUsers, (u) => _.indexOf(uIds, u.id) !== -1));
    }
  }, [currentUser, allUsers, bindAllUsers, relations]);

  const subHeader = () => (
    <div className="requests-subheader" aria-label="Subheader">
      <Link to="/app/alerts">
        <img
          src={require("assets/svgs/LeftArrow.svg").default}
          className="go-back-icon"
          alt="LeftArrow"
        />
      </Link>
      <div className="page-name">Pending requests</div>
    </div>
  );

  return (
    <div>
      <HeaderComponent />
      <div>
        <div className="dashboard-content">
          {subHeader()}
          <hr className="m-0 p-0" />
          <div className="user-container">
            {users[0] ? (
              <div>
                {" "}
                {users.map((u, idx) => (
                  <UserComponent
                    displayUser={u}
                    currentUser={currentUser}
                    key={idx}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center mt-5">
                There are no pending requests.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { allUsers } = state.users;
  const { relations, pendingRelationsCount } = state.relationships;
  return { allUsers, relations, pendingRelationsCount };
};

const mapDispatchToProps = (dispatch) => {
  return {
    bindAllUsers: (content, type, searchVal) =>
      dispatch(SetAllUsers(content, type, searchVal)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ParentComponent);
