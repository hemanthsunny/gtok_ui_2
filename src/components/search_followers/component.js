import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import "./style.css";

import HeaderComponent from "./header";
import UserComponent from "./user/component";
import { SetAllUsers } from "store/actions";
import { MobileFooterComponent } from "components";

const ParentComponent = ({
  currentUser,
  allUsers,
  bindAllUsers,
  relations,
  pendingRelationsCount,
  newAlertsCount,
  newMessagesCount,
}) => {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    if (!allUsers[0]) {
      bindAllUsers(currentUser, "all");
    }
    if (relations[0]) {
      const rlns = relations.filter(
        (rln) => rln.userIdTwo === currentUser.id && rln.status === 1
      );
      const uIds = _.map(rlns, "userIdOne");
      setFollowers(_.filter(allUsers, (u) => _.indexOf(uIds, u.id) !== -1));
    }
  }, [currentUser, allUsers, bindAllUsers, relations]);

  return (
    <div>
      <HeaderComponent
        newAlertsCount={newAlertsCount}
        newMessagesCount={newMessagesCount}
      />
      <div className="dashboard-content">
        <div className="container mt-5 pt-2 pt-md-5 px-4">
          {followers[0] ? (
            <div className="row">
              {" "}
              {followers.map((f, idx) => (
                <UserComponent
                  displayUser={f}
                  currentUser={currentUser}
                  key={idx}
                />
              ))}
            </div>
          ) : (
            <div className="text-center mt-5">
              There are currently no followers. Here you can{" "}
              <Link to="/app/search" className="text-violet">
                {" "}
                look for your friends.
              </Link>
            </div>
          )}
        </div>
      </div>
      <MobileFooterComponent currentUser={currentUser} />
    </div>
  );
};

const mapStateToProps = (state) => {
  const { allUsers } = state.users;
  const { relations, pendingRelationsCount } = state.relationships;
  const { newAlertsCount } = state.alerts;
  const { newMessagesCount } = state.chatMessages;
  return {
    allUsers,
    relations,
    pendingRelationsCount,
    newAlertsCount,
    newMessagesCount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    bindAllUsers: (content, type, searchVal) =>
      dispatch(SetAllUsers(content, type, searchVal)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ParentComponent);
