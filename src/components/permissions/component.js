import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import HeaderComponent from './header';

import { add, update, timestamp } from "firebase_config";
import { SetPermissions } from "store/actions";

function PermissionsComponent({currentUser, pms, bindPermissions}) {
	const [ loading, setLoading ] = useState(true);
	const [ userPms, setUserPms ] = useState(currentUser.permissions || {});
	const [result, setResult] = useState({});

	useEffect(() => {
		if (!pms[0]) bindPermissions(currentUser);
		setLoading(false);
	}, [currentUser, pms, bindPermissions]);

	const handleChange = async (key, value) => {
		setLoading(true);
		userPms[key] = !userPms[key];
		setUserPms((prevState) =>({...prevState, ...userPms}));
		setLoading(false);
	}

	const savePms = async () => {
		setLoading(true);
		let result = await update("users", currentUser.id, {permissions: userPms});
		/* Log the activity */
  	await add("logs", {
  		text: `${currentUser.displayName} updated permissions`,
  		photoURL: currentUser.photoURL,
  		receiverId: "",
  		userId: currentUser.id,
  		actionType: "update",
  		collection: "users",
  		actionId: currentUser.id,
  		actionKey: "permissions",
  		description: userPms,
  		timestamp
  	});
		setResult(result);
		setLoading(false);
	}

	return (
    <div>
      <HeaderComponent save={savePms} loading={loading}/>
  	  <div className="container permissions-wrapper">
  			{
  	  		pms.map((pm, idx) => (
  					<div className="d-flex align-content-center ml-2" key={idx}>
  						<div className="mb-2">
  						  <input type="checkbox" className="custom-control-input" id={pm.name} name={pm.name} onChange={e => handleChange(pm.name, e.target.value)} checked={userPms[pm.name]} />
  						  <label className="custom-control-label ml-2" htmlFor={pm.name}>
  						  	{pm.description}
  						  </label>
  						</div>
  					</div>
  	  		))
    		}
    		<div className="text-center">
  	    	{
  	    		result.status &&
  	    		<div className={`text-${result.status === 200 ? "success" : "danger"} mb-2`}>
  			    	{result.message}
  	    		</div>
  	    	}
  			</div>
  		</div>
    </div>
	);
}

const mapStateToProps = (state) => {
	const { pms } = state.permissions;
	return { pms };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindPermissions: (content) => dispatch(SetPermissions(content))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PermissionsComponent);
