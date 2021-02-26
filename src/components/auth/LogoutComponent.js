import React from "react";
import { StaticHeaderComponent } from "components";

const LogoutComponent = () => (
  <div className="App">
  	<StaticHeaderComponent />
  	<div className="mt-5 pt-3">
      <h5>Succesfully logged out.</h5>
      <a href="/login">Login again</a>
    </div>
  </div>
);

export default LogoutComponent;