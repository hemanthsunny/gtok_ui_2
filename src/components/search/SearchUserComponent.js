import React, { useState, useEffect } from "react";
import { useHistory, Link } from 'react-router-dom';
import { connect } from "react-redux";

import { getQuery, firestore } from "firebase_config";
import { NotificationComponent } from "components";
import { capitalizeFirstLetter } from "helpers";
import { gtokFavicon } from "images";
import { createRelationships } from "lib/api";
import { SetRelationships } from "store/actions";

const SearchUserComponent = ({displayUser, currentUser, relations, bindRelationships}) => {
	const history = useHistory();
	const [ follower, setFollower ] = useState(null);
	const [ isFollowerLoading, setIsFollowerLoading ] = useState(false);
	const [ result, setResult ] = useState({});
	/*
	const StatusCodes = {
		0: "Pending",
		1: "Accepted/Followed",
		2: "Declined",
		3: "Blocked"
	}*/

	useEffect(() => {
		if (relations[0]) {
			let relation = relations.find(rln => rln["userIdOne"] === currentUser.id && rln["userIdTwo"] === displayUser.id);
			if (relation && relation.id) {
				setFollower(relation.status);
			};
		}
	}, [relations, currentUser, displayUser])

	const relationStatus = async (status) => {
		if (status==="block" && 
			!window.confirm("Are you sure to block "+displayUser.displayName+"?")) {
			return null;
		}
		setIsFollowerLoading(true);
		let res = await createRelationships(currentUser, displayUser, status);
  	await bindRelationships(currentUser);
		let rlns = await getQuery(
			firestore.collection("userRelationships").where("userIdOne", "==", currentUser.id).where("userIdTwo", "==", displayUser.id).get()
		);
		if (rlns[0]) setFollower(rlns[0].status);
		setIsFollowerLoading(false);
		setResult(res);
	}

  const msgUser = async () => {
  	history.push("/app/chats/new/"+displayUser.id);
  }

  return (
		<div className="col-xs-12 my-xs-2 my-md-3">
			<div className="card p-2 card-br-0">
				{result.status && <NotificationComponent result={result} setResult={setResult} />}
				<div className="media profile_card_img">
					{
						follower !== 3 ?
				  	<Link to={"/app/profile/"+displayUser.id}>
					  	<img className="mr-2" src={displayUser.photoURL || gtokFavicon} alt="Card img cap" />
				  	</Link> :
				  	<img className="mr-2" src={displayUser.photoURL || gtokFavicon} alt="Card img cap" />
					}
				  <div className="media-body">
				    <h6 className="mt-0 text-camelcase">
					  	<Link to={"/app/profile/"+displayUser.id}>
					    	{(displayUser.displayName && capitalizeFirstLetter(displayUser.displayName)) || "No name"}
					   	</Link>
				    </h6>
				    <div>
							<div className="btn-group">
					  		<button className={`btn btn-sm ${follower ? "btn-secondary" : "btn-outline-secondary"}`} onClick={e => relationStatus("follow")}>
						    {
						    	isFollowerLoading ? <i className="fa fa-spinner fa-spin"></i> : (
							    	<small className="pull-right">{
							    		follower === 0 ? "Pending" : (
							    		follower === 1 ? "Following" : (
							    			follower === 3 ? "Blocked" : "Follow"
							    		)
							    		)
							    	}</small>
							    )
						    }
						    </button>
							  <button type="button" className="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split pt-0 pb-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							    <span className="sr-only">Toggle Dropdown</span>
							  </button>
							  <div className="dropdown-menu">
							  	{ follower === 0 &&
								    <button className="dropdown-item" onClick={e => relationStatus("cancel_request")}>
								    	<i className="fa fa-times"></i>&nbsp;Cancel Request
								    </button>}
							    { follower === 1 &&
							    	<button className="dropdown-item" onClick={e => relationStatus("unfollow")}>
							    		<i className="fa fa-times"></i>&nbsp;Unfollow
							    	</button>}
							    { follower !== 0 && follower !== 3 &&
							    	<button className="dropdown-item" onClick={e => relationStatus("block")}>
							    		<i className="fa fa-ban"></i>&nbsp; Block
							    	</button>}
							    { follower === 3 &&
							    	<button className="dropdown-item" onClick={e => relationStatus("unblock")}>
							    		<i className="fa fa-ban"></i>&nbsp; Unblock
							    	</button>}
							  </div>
							</div>
							{
								follower !== 3 &&
						    <Link to={"/app/profile/"+displayUser.id} className="btn btn-outline-secondary btn-sm pull-right ml-2" title="Show similarities">
						    	<i className="fa fa-bar-chart"></i>
						    </Link>
							}
							{
								follower !== 3 &&
						    <button className="btn btn-sm btn-outline-secondary pull-right" onClick={e => msgUser()} title="Start chat">
						    	<i className="fa fa-comment"></i>
							  </button>
							}
						{/*
					    <button className="btn btn-sm btn-outline-secondary pull-right" onClick={e => createRelationships(displayUser)} title="Start chat">
					    	Add relations
						  </button>
						*/}
				    </div>
				  </div>
			  </div>
			  <div className="pull-right pt-0">
			  </div>
			</div>
		</div>
  );
};

const mapStateToProps = (state) => {
	const { relations } = state.relationships;
	return { relations };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindRelationships: (content, type) => dispatch(SetRelationships(content, type))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchUserComponent);