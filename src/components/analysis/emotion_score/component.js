import React, { useState, useEffect } from "react";
import $ from "jquery";
import "./style.css";

const EmotionScoreComponent = ({ currentUser, labels, currentUserAssets, allUserAssets }) => {
  const [hideDescription, setHideDescription] = useState(false);

  useEffect(() => {
    $(".score-description").css("display", "none");
  }, []);

  const showDescription = () => {
    setHideDescription(!hideDescription);
    if (hideDescription) {
      $(".score-description").fadeOut();
    } else {
      $(".score-description").fadeIn();
    }
  };

  const calcOverallScore = () => {
    const cuScore = currentUserAssets.map(arr => arr.length).reduce(function(a, b) {
      return a + b;
    }, 0);
    const auScore = allUserAssets.map(arr => arr.length).reduce(function(a, b) {
      return a + b;
    }, 0);
    return (cuScore / auScore).toFixed(2);
  };

  return <div className="emotion-score-wrapper mt-5 pt-4">
    <div className="card mx-3 mx-sm-0">
      <div className="card-body">
        <div className="username">@{currentUser.username}</div>
        <div className="emotion-score">
          Your Emotional Score: {calcOverallScore()}
        </div>
        <div className="btn btn-sm btn-violet-rounded question-mark" onClick={showDescription}>
          <span >&#63;</span>
        </div>
      </div>
      <div className="card-footer score-description">
        <span className="btn btn-sm btn-violet-rounded question-mark">
          <span>&#63;</span>
        </span>
        Your Emotional Score is calculated based on total number of feelings you've shared on the letsgtok platform.
      </div>
    </div>
  </div>;
};

export default EmotionScoreComponent;
