import React from "react";
import { LoadingComponent } from "components";

const ChatComponent = ({
  currentUser,
  convos,
  loading,
  selectConvo,
  renderConvo,
  convoId,
}) => {
  return (
    <div className="container">
      {loading ? (
        <LoadingComponent />
      ) : convos[0] ? (
        <ul className="conversation-list p-0">
          {convos.map((con, idx) => (
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
        <div className="p-4 text-center">No chats found</div>
      )}
      <div
        className="new-chat"
        data-target="#createChatModal"
        data-toggle="modal"
      >
        <img
          src={require("assets/svgs/Chat.svg").default}
          className="icon-chat"
          alt="Chats"
        />
      </div>
    </div>
  );
};

export default ChatComponent;
