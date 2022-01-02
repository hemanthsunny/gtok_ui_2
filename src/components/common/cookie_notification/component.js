import React, { useState, useEffect } from "react";
import "./index.css";

const CookieNotification = () => {
  const [cookie, setCookie] = useState(localStorage.getItem("cookieSeen"));

  useEffect(() => {
    if (cookie) {
      setCookie(localStorage.getItem("cookieSeen"));
    }
  }, [cookie]);

  const closeCookieBanner = () => {
    localStorage.setItem("cookieSeen", "shown");
    setCookie("shown");
  };

  return (
    <div className={`cookie-banner ${cookie ? "d-none" : ""}`}>
      <p className="pb-0">
        By using this website, you agree to our use of{" "}
        <a
          href="https://letsgtok.com/cookie_policy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet"
        >
          cookie policy
        </a>
        . We use cookies to provide you with a great experience and to help our
        website run effectively.
      </p>
      <button
        className="btn btn-sm p-1 px-2 btn-violet"
        onClick={(e) => closeCookieBanner()}
      >
        Got it
      </button>
    </div>
  );
};

export default CookieNotification;
