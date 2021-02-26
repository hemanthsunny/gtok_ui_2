import React from "react";
import { StaticHeaderComponent } from "components";

const DeleteProfileComponent = () => {
  return (
    <div className="App">
    	<StaticHeaderComponent />
    	<div className="mt-5 pt-3">
	      <h5>Your account is deleted. We hope you come back.</h5>
	      <a href="/signup">Signup here</a>
	    </div>
    </div>
  );
};

export default DeleteProfileComponent;