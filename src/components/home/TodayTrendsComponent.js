import React from "react";
import { connect } from "react-redux";

const TodayTrendsComponent = ({currentUser, trendingPosts}) => {
  return (
		<div className="card">
			<div className="card-title">Today Trends</div>
			<div>
				{console.log("trendingPosts", trendingPosts)}
			</div>
		</div>
  );
};

const mapStateToProps = (state) => {
	const { trendingPosts } = state.trendingPosts;
	return { trendingPosts };
}

export default connect(
	mapStateToProps,
	null
)(TodayTrendsComponent);