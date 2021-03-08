import React from "react";

const CustomImageComponent = ({ user, size }) => {
  return (
    <div>
      {
        user.photoURL ?
        <img src={user.photoURL} alt={user.displayName.charAt(0)} className={`custom-image ${size == "lg" && "-lg"}`} /> :
        <div className={`custom-image-text text-capitalize ${size == "lg" && "-lg"}`}>{user.displayName ? user.displayName.charAt(0) : "LG"}</div>
      }
    </div>
  )
};

export default CustomImageComponent;
