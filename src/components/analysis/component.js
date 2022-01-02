import React, { useState, useEffect } from "react";
import "./style.css";

import DoughnutChart from "./doughnut/component";
import LineChart from "./linechart/component";
import EmotionScoreComponent from "./emotion_score/component";
import HeaderComponent from "./header";

import { categories, categoryColors } from "constants/categories";
import { capitalizeFirstLetter } from "helpers";
import { getQuery, firestore } from "firebase_config";

function ProfileGraphsComponent({ currentUser }) {
  const [currentUserAssets, setCurrentUserAssets] = useState();
  const [allUserAssets, setAllUserAssets] = useState();

  const labels = categories.map((elem, idx) => {
    if (elem.key === "angry") {
      return "Anger";
    }
    elem = elem.key && capitalizeFirstLetter(elem.key.replace("_", " "));
    return elem;
  });

  useEffect(() => {
    async function getUserAssets() {
      const assets = await getQuery(
        firestore
          .collection("posts")
          .get()
      );

      /* calculate current user assets */
      const currentUserAssets = assets.filter(post => post.userId === currentUser.id);
      if (currentUserAssets.length > 0) {
        setCurrentUserAssets([
          currentUserAssets?.filter(
            (elem) =>
              elem.category &&
              (elem.category.key === "current_feeling" ||
                elem.category.key === "same_pinch")
          ),
          currentUserAssets?.filter(
            (elem) => elem.category && elem.category.key === "happy"
          ),
          currentUserAssets?.filter((elem) => elem.category && elem.category.key === "sad"),
          currentUserAssets?.filter(
            (elem) => elem.category && elem.category.key === "surprise"
          ),
          currentUserAssets?.filter(
            (elem) => elem.category && elem.category.key === "fear"
          ),
          currentUserAssets?.filter(
            (elem) => elem.category && elem.category.key === "angry"
          ),
          currentUserAssets?.filter(
            (elem) => elem.category && elem.category.key === "special"
          ),
          currentUserAssets?.filter(
            (elem) => elem.category && elem.category.key === "other"
          ),
        ]);
      }

      /* calculate all users assets */
      if (assets.length > 0) {
        setAllUserAssets([
          assets?.filter(
            (elem) =>
              elem.category &&
              (elem.category.key === "current_feeling" ||
                elem.category.key === "same_pinch")
          ),
          assets?.filter(
            (elem) => elem.category && elem.category.key === "happy"
          ),
          assets?.filter((elem) => elem.category && elem.category.key === "sad"),
          assets?.filter(
            (elem) => elem.category && elem.category.key === "surprise"
          ),
          assets?.filter(
            (elem) => elem.category && elem.category.key === "fear"
          ),
          assets?.filter(
            (elem) => elem.category && elem.category.key === "angry"
          ),
          assets?.filter(
            (elem) => elem.category && elem.category.key === "special"
          ),
          assets?.filter(
            (elem) => elem.category && elem.category.key === "other"
          ),
        ]);
      }
    }
    if (!currentUserAssets || !allUserAssets) {
      getUserAssets();
    }
  });

  return (
    <div className="dashboard-content">
      <HeaderComponent />
      <div className="profile-graphs-container">
        {currentUserAssets?.length > 0 && allUserAssets?.length > 0 && (
          <div className="graphs">
            <EmotionScoreComponent currentUser={currentUser} labels={labels} currentUserAssets={currentUserAssets} allUserAssets={allUserAssets} />
            <DoughnutChart
              labels={labels}
              data={currentUserAssets}
              colors={categoryColors}
            />
            <LineChart labels={labels} data={currentUserAssets} colors={categoryColors} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileGraphsComponent;
