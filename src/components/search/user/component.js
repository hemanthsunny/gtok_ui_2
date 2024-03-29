import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";

import { getQuery, firestore } from "firebase_config";
import { CustomImageComponent } from "components";
import { capitalizeFirstLetter, truncateText } from "helpers";
import { createRelationships } from "lib/api";
import { SetRelationships } from "store/actions";

const SearchUserComponent = ({
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
          <div className="media-body pl-2">
            <Link
              className="username"
              to={"/app/profile/" + displayUser.username}
            >
              {displayUser.username}
              <br />
              <span className="actual-name">
                {displayUser.bio
                  ? truncateText(displayUser.bio, 15)
                  : displayUser.displayName &&
                    capitalizeFirstLetter(displayUser.displayName)}
              </span>
            </Link>
            <div className="pull-right">
              <button className="btn btn-link">
                {isFollowerLoading ? (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <small className="pull-right">
                    {follower === null ? (
                      <img
                        className="icon-search-chat"
                        src={require("assets/svgs/SendRequest.svg").default}
                        alt="Follow"
                        onClick={(e) => relationStatus("follow")}
                      />
                    ) : follower === 0 ? (
                      <img
                        className="icon-search-chat"
                        src={require("assets/svgs/SentRequest.svg").default}
                        alt="Pending"
                        onClick={(e) => relationStatus("cancel_request")}
                      />
                    ) : (
                      follower === 3 && "Blocked"
                    )}
                  </small>
                )}
              </button>
              <button
                type="button"
                className="d-none btn btn-sm btn-violet-outline dropdown-toggle dropdown-toggle-split pt-0 pb-0"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="sr-only">Toggle Dropdown</span>
              </button>
              <div className="dropdown-menu d-none">
                {follower === 0 && (
                  <button
                    className="dropdown-item"
                    onClick={(e) => relationStatus("cancel_request")}
                  >
                    <i className="fa fa-times"></i>&nbsp;Cancel Request
                  </button>
                )}
                {follower === 1 && (
                  <button
                    className="dropdown-item"
                    onClick={(e) => relationStatus("unfollow")}
                  >
                    <i className="fa fa-times"></i>&nbsp;Unfollow
                  </button>
                )}
                {follower !== 0 && follower !== 3 && (
                  <button
                    className="dropdown-item"
                    onClick={(e) => relationStatus("block")}
                  >
                    <i className="fa fa-ban"></i>&nbsp; Block
                  </button>
                )}
                {follower === 3 && (
                  <button
                    className="dropdown-item"
                    onClick={(e) => relationStatus("unblock")}
                  >
                    <i className="fa fa-ban"></i>&nbsp; Unblock
                  </button>
                )}
              </div>
            </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchUserComponent);
