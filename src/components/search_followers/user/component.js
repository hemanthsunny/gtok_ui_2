import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";

import { getQuery, firestore } from "firebase_config";
import { CustomImageComponent } from "components";
import { capitalizeFirstLetter } from "helpers";
import { createRelationships } from "lib/api";
import { SetRelationships } from "store/actions";

const UserComponent = ({
  displayUser,
  currentUser,
  relations,
  bindRelationships,
}) => {
  const [follower, setFollower] = useState(null);
  const [isFollowerLoading, setIsFollowerLoading] = useState(false);
  /*
  const StatusCodes = {
    0: 'Pending',
    1: 'Accepted/Followed',
    2: 'Declined',
    3: 'Blocked'
  } */

  useEffect(() => {
    if (relations[0]) {
      const relation = relations.find(
        (rln) =>
          rln.userIdOne === currentUser.id && rln.userIdTwo === displayUser.id
      );
      if (relation && relation.id) {
        setFollower(relation.status);
      }
    }
  }, [relations, currentUser, displayUser]);

  const relationStatus = async (status) => {
    if (
      status === "block" &&
      !window.confirm("Are you sure to block " + displayUser.displayName + "?")
    ) {
      return null;
    }
    setIsFollowerLoading(true);
    const res = await createRelationships(currentUser, displayUser, status);
    await bindRelationships(currentUser);
    const rlns = await getQuery(
      firestore
        .collection("userRelationships")
        .where("userIdOne", "==", currentUser.id)
        .where("userIdTwo", "==", displayUser.id)
        .get()
    );
    if (rlns[0]) setFollower(rlns[0].status);
    setIsFollowerLoading(false);
    if (res.status === 200 && status === "follow" && displayUser.private) {
      toast.success("Follow request sent");
    } else if (
      res.status === 200 &&
      status === "follow" &&
      !displayUser.private
    ) {
      toast.success("Following successfully");
    } else if (res.status === 200 && status === "cancel_request") {
      toast.success("Follow request canceled");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="search-user col-12 my-2 my-md-3">
      <div className="p-0">
        <div className="media profile-user">
          <Link to={"/app/profile/" + displayUser.username}>
            <CustomImageComponent user={displayUser} />
          </Link>
          <div className="media-body pl-3">
            <Link
              className="username"
              to={"/app/profile/" + displayUser.username}
            >
              @{displayUser.username}
              <br />
              <span className="actual-name">
                {(displayUser.displayName &&
                  capitalizeFirstLetter(displayUser.displayName)) ||
                  "No name"}
              </span>
            </Link>
            <button className="btn btn-link px-0 pull-right">
              {isFollowerLoading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <small>
                  {follower === 0 ? (
                    <img
                      className="icon-search-chat"
                      src={require("assets/svgs/SentRequest.svg").default}
                      alt="Pending"
                      onClick={(e) => relationStatus("cancel_request")}
                    />
                  ) : (
                    follower === null && (
                      <img
                        className="icon-search-chat"
                        src={require("assets/svgs/SendRequest.svg").default}
                        alt="Follow"
                        onClick={(e) => relationStatus("follow")}
                      />
                    )
                  )}
                </small>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { relations } = state.relationships;
  return { relations };
};

const mapDispatchToProps = (dispatch) => {
  return {
    bindRelationships: (content, type) =>
      dispatch(SetRelationships(content, type)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserComponent);
