import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import HeaderComponent from './header';
import UserDetailComponent from "./children/user_detail/component";
import PostsComponent from "./children/posts/component";
import ActivitiesComponent from "./children/activities/component";
import { SidebarComponent } from "components";

function ParentComponent({currentUser, computedMatch}) {
	const [ activeTab, setActiveTab ] = useState("posts");
	const userId = computedMatch.params.user_id;
	return (
		<div style={{background: "rgba(0,0,0,0.01)"}}>
      <HeaderComponent userId={userId} currentUserId={currentUser.id} />
			<div>
				<SidebarComponent currentUser={currentUser} />
				<div className="dashboard-content pt-4 pt-sm-0">
					<UserDetailComponent currentUser={currentUser} />
					{activeTab === "posts" && <PostsComponent currentUser={currentUser} setActiveTab={setActiveTab} />}
					{activeTab === "activities" && <ActivitiesComponent currentUser={currentUser} setActiveTab={setActiveTab} />}
				</div>
			</div>
		</div>
	)
}

export default ParentComponent;
