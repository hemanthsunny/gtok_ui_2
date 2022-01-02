import React, { useState, useEffect } from "react";
import "./style.css";

import DoughnutChart from "./doughnut/component";
import LineChart from "./linechart/component";
import HeaderComponent from "./header";

import { categories, categoryColors } from "constants/categories";
import { capitalizeFirstLetter } from "helpers";
import { getQuery, firestore } from "firebase_config";

function ProfileGraphsComponent({ currentUser }) {
  const [data, setData] = useState();
  const labels = categories.map((elem, idx) => {
    if (elem.key === "angry") {
      return "Anger";
    }
    elem = elem.key && capitalizeFirstLetter(elem.key.replace("_", " "));
    return elem;
  });

  useEffect(() => {
    async function getUserAssets() {
      const posts = await getQuery(
        firestore
          .collection("posts")
          .where("userId", "==", currentUser.id)
          .get()
      );
      if (posts.length > 0) {
        setData([
          posts?.filter(
            (elem) =>
              elem.category &&
              (elem.category.key === "current_feeling" ||
                elem.category.key === "same_pinch")
          ),
          posts?.filter(
            (elem) => elem.category && elem.category.key === "happy"
          ),
          posts?.filter((elem) => elem.category && elem.category.key === "sad"),
          posts?.filter(
            (elem) => elem.category && elem.category.key === "surprise"
          ),
          posts?.filter(
            (elem) => elem.category && elem.category.key === "fear"
          ),
          posts?.filter(
            (elem) => elem.category && elem.category.key === "angry"
          ),
          posts?.filter(
            (elem) => elem.category && elem.category.key === "special"
          ),
          posts?.filter(
            (elem) => elem.category && elem.category.key === "other"
          ),
        ]);
      }
    }
    if (!data) {
      getUserAssets();
    }
  });

  return (
    <div className="dashboard-content">
      <HeaderComponent />
      <div className="profile-graphs-container">
        {data && data.length > 0 && (
          <div className="graphs">
            <DoughnutChart
              labels={labels}
              data={data}
              colors={categoryColors}
            />
            <LineChart labels={labels} data={data} colors={categoryColors} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileGraphsComponent;
