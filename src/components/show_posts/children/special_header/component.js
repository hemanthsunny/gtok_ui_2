import React from "react";
import { useHistory } from "react-router-dom";

import { specialCategory } from "constants/categories";

const ParentComponent = ({ currentUser }) => {
  const history = useHistory();

  const redirectToCreatePage = () => {
    history.push({
      pathname: "/app/create_asset",
      state: {
        sharePost: {
          category: {
            key: specialCategory.key,
            title: specialCategory.title,
          },
        },
      },
    });
  };

  return (
    <div className="text-center mx-3 mx-sm-0">
      <button
        className={`btn btn-sm btn-${specialCategory.key === "special" ? "special" : "violet"}-outline-r`}
        onClick={redirectToCreatePage}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: specialCategory.homepage_description,
          }}
        ></span>
      </button>
    </div>
  );
};

export default ParentComponent;
