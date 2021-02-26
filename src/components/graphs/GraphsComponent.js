import React from "react";
import { Link } from 'react-router-dom';

const GraphsComponent = (props) => {
  return (
    <div>
      <h1>GraphsComponent</h1>
      {console.log(props)}
      <Link to="/app/profile">Profile</Link>
    </div>
  );
};

export default GraphsComponent;