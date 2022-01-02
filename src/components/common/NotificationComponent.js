import React from "react";

const NotificationComponent = ({ result, setResult }) => {
  setTimeout(() => {
    setResult({});
  }, 5000);
  const { status, message } = result;
  return (
    <div
      className={`notification alert fade show ${
        status === 100
          ? "alert-warning"
          : status === 200
          ? "alert-success"
          : "alert-danger"
      }`}
    >
      {message || "Try after some time"}
    </div>
  );
};

export default NotificationComponent;
