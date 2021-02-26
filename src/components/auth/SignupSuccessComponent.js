import React from "react";
import { StaticHeaderComponent } from "components";

const SignupSuccessComponent = () => (
  <div className="App">
  	<StaticHeaderComponent />
  	<div className="mt-5 pt-3">
  		{/*
      <h5>
      Thank you for signing up. Kindly verify your email.<br/>
  		<div className="h3 text-success py-4"><i className="fa fa-check-circle fa-2x"></i></div>
      Our app is under construction. We will notify you once our Lets Gtok is ready.
      </h5>
      <p>
      	Meanwhile, Connect us in
      	<a href="https://www.youtube.com/channel/UCimnYWrV3fkqL2hz0-oQ61Q" target="_blank" rel="noopener noreferrer"> Youtube</a><br/>
      	Or <br/>
      	<a href="https://letsgtok.com/blog" target="_blank" rel="noopener noreferrer">Read our blogs</a>
      </p>
      <h5>Succesfully signed up. Kindly verify your email.</h5>
      <a href="/login">Login</a>*/}
  		<div className="h3 text-success py-4"><i className="fa fa-check-circle fa-2x"></i></div>
      <h5 className="text-center text-secondary">
	      Succesfully signed up. Kindly verify your email.<br/>
      </h5>
    	<a href="/login"> Login here</a>
    </div>
  </div>
);

export default SignupSuccessComponent;