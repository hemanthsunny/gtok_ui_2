import React from "react";
import { LoadingComponent } from "components";

const RequestComponent = ({
  currentUser,
  requestedConvos,
  loading,
  selectConvo,
  renderConvo,
  convoId,
}) => {
  return (
    <div>
      <div className="container">
        {loading ? (
          <LoadingComponent />
        ) : requestedConvos[0] ? (
          <ul className="conversation-list p-0">
            {requestedConvos.map((con, idx) => (
              <li
                onClick={(e) => selectConvo(con)}
                key={idx}
                className={`${con.id === convoId ? "active" : ""}`}
              >
                {renderConvo(con)}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center">No chat requests found</div>
        )}
      </div>
      <div className="request-note">
        Requests come from people who aren't on your list of followers.
      </div>
    </div>
  );
};

export default RequestComponent;
