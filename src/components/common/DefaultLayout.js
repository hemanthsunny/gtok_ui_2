import React from "react";
import { connect } from "react-redux";

import { HeaderComponent, BottomHeaderComponent, UserPermissionsComponent } from "components";

const DefaultLayout = ({children, dbUser}) => {
  return (
    <div>
    	{ (window.innerWidth < 576) ? <BottomHeaderComponent currentUser={dbUser} /> : <HeaderComponent currentUser={dbUser} />}
			<UserPermissionsComponent />
    	<div className="mt-5 mb-5 pt-3 bottom-sm-padding">
		  	{children}
    	</div>
    </div>
  );
};

const mapStateToProps = (state) => {
	const { dbUser } = state.authUsers;
	return { dbUser };
}

export default connect(
	mapStateToProps,
	null
)(DefaultLayout);
