import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import HeaderComponent from "./header";
import { getQuery, firestore } from "firebase_config";

const ParentComponent = (props) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      let posts = await getQuery(
        firestore
          .collection("activities")
          .orderBy("createdAt", "desc")
          .limit(20)
          .get()
      );
      posts = posts.sort((a, b) => b.createdAt - a.createdAt);
      setPosts(posts);
    }
    loadPosts();
  }, []);

  const subHeader = () => (
    <div className="dashboard-tabs" role="navigation" aria-label="Main">
      <div className="tabs -big">
        <Link to="/posts" className="tab-item">
          Feelings
        </Link>
        <Link to="/activities" className="tab-item -active">
          Activities
        </Link>
      </div>
    </div>
  );

  return (
    <div>
      <HeaderComponent />
      <div className="dashboard-content -open-route">
        <div className="feeling-wrapper">
          {subHeader()}
          {posts[0] &&
            posts.map(
              (post, idx) =>
                !post.premium && (
                  <div className="card post-card-wrapper" key={idx}>
                    <div>
                      <span className="card-badge mr-2">
                        {moment(post.createdAt).format("DD/MM/YY HH:mm")}
                      </span>
                      <span
                        className="card-badge"
                        onClick={(e) =>
                          window.alert("Login to see who created this post.")
                        }
                      >
                        @Anonymous
                      </span>
                    </div>
                    <div className="card-body pt-2">
                      <div className="white-space-preline">
                        <small>{post.activity}</small>
                      </div>
                      <div className="description">{post.description}</div>
                      <div className="edit-options float-right">
                        <button
                          className="btn btn-link"
                          onClick={(e) =>
                            window.alert("Login to share the post.")
                          }
                        >
                          <i className="fa fa-share-alt"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                )
            )}
          <div className="extra-section">
            <Link to="/login" className="btn btn-violet">
              Unlock secret activities
            </Link>{" "}
            <br />
            <img
              className="mr-3 "
              src={require("assets/svgs/celebrations.svg").default}
              alt="6"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentComponent;
