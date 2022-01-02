import React, { useState } from "react";
import { connect } from "react-redux";
import $ from "jquery";
import "./style.css";

import { ReportOptions } from "constants/report_options";
import { add, getQuery, firestore, timestamp } from "firebase_config";

const ParentComponent = ({
  currentUser,
  sharePost,
  sharePost: displayPost,
}) => {
  const [report, setReport] = useState("");
  const [other, setOther] = useState(false);
  const [otherValue, setOtherValue] = useState("");

  const save = async (e) => {
    if (!report) {
      alert("Please choose a suitable option.");
      return null;
    }
    const isAlreadyReported = await getQuery(
      firestore
        .collection("reportPosts")
        .where("postId", "==", displayPost.id)
        .where("userId", "==", currentUser.id)
        .get()
    );
    if (isAlreadyReported[0]) {
      alert("This post has already been reported by you.");
    } else {
      await add("reportPosts", {
        userId: currentUser.id,
        postId: sharePost.id,
        report,
      });
      /* Log the activity */
      await add("logs", {
        text: `${currentUser.displayName} reported a post`,
        userId: currentUser.id,
        actionType: "add",
        collection: "reportPosts",
        actionLink: "/app/reportPosts/" + sharePost.id,
        timestamp,
      });
      alert("Thanks for informing us. Your report has been received.");
    }
    closeModal();
    // $('[data-dismiss=modal]').trigger({ type: 'click' })
  };

  const handleChange = (rep) => {
    if (rep) {
      setReport(rep);
      if (rep.key === "other") {
        setOther(true);
      } else {
        setOther(false);
      }
    }
  };

  const closeModal = () => {
    $("#reportPostModal").hide();
    $(".modal-backdrop").remove();
  };

  return (
    <div
      className="modal fade"
      id="reportPostModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="reportPostModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body pt-0">
            <div className="text-center">
              <img
                className="btn-play"
                src={require("assets/svgs/Accessibility.svg").default}
                alt="1"
              />
            </div>
            <div className="user-list">
              <p className="title">Why are you reporting this post?</p>
              {ReportOptions.map((rep, idx) => (
                <div
                  className="post-category"
                  key={idx}
                  onClick={(e) => handleChange(rep)}
                >
                  <div className="username pull-left">{rep.title}</div>
                  <div className={`${rep.key === report.key ? "" : "d-none"}`}>
                    <img
                      className="btn-play"
                      src={require("assets/svgs/Tick.svg").default}
                      alt="1"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className={`${other ? "other-category-box" : "d-none"}`}>
              <textarea
                className="form-control"
                value={otherValue}
                onChange={(e) => setOtherValue(e.target.value)}
                placeholder="Type here"
              ></textarea>
            </div>
            <div className="text-center mt-3">
              <button className="btn btn-violet-rounded btn-sm" onClick={save}>
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { sharePost } = state.posts;
  return { sharePost };
};

export default connect(mapStateToProps, null)(ParentComponent);
