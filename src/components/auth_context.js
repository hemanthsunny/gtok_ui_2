import React from "react";

const AuthContext = React.createContext(null);

export const withAuth = (Component) => (props) => (
	<AuthContext.Provider>
		{(auth) => <Component {...props} auth={auth} />}
	</AuthContext.Provider>
);

export default AuthContext;
