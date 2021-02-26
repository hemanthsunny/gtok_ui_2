import React, { useState } from "react";
import { connect } from "react-redux";

import { getQuery, firestore } from "firebase_config";
import { SimilarityChecker } from "lib/api/SimilarityChecker";
import { GeneratePostComponent } from "components";
import { capitalizeFirstLetter } from "helpers";

const SimilarityComponent = ({
	currentUser, selectedUser, surveysList
}) => {
	const [ similarityResult, setSimilarityResult ] = useState();
	const [ similarityDescription, setSimilarityDescription ] = useState();
	const [ generatePost, setGeneratePost ] = useState(false);

	const handleChange = async (val, key) => {
		let result = "";
		if (key === "timeline") {
			if (val === "last_2_days") {
				setSimilarityResult("No similarities found in last 2 days");
			} else if (val === "last_7_days") {
				setSimilarityResult("No similarities found in last week");
			} else if (val === "last_30_days") {
				setSimilarityResult("No similarities found in last month");
			} else if (val === "last_365_days") {
				setSimilarityResult("No similarities found in last year");
			}
		} else {
			let responses = [];
			responses = await getQuery(
				firestore.collection("survey_responses").where("surveyId", "==", val).where("userId", "in", [currentUser.id, selectedUser.id]).get()
			);
			let userResponses = [];
			let res1 = responses.find(res => res.userId === currentUser.id);
			if (!!res1) userResponses.push(res1);
			let res2 = responses.find(res => res.userId === selectedUser.id);
			if (!!res2) userResponses.push(res2);
			if (userResponses.length === 2) {
				result = await SimilarityChecker(responses);
				setSimilarityResult(result.common);
			} else if (userResponses.length === 1){
				setSimilarityResult(capitalizeFirstLetter(selectedUser.displayName)+" has not yet completed this category");
			} else {
				setSimilarityResult("");
			}
			setSimilarityDescription(result.description);
		}
	}

	const clearInfo = () => {
		setSimilarityResult("");
		setSimilarityDescription("");
	}

	return (
		<div className="my-2 pt-1">
			{/*<LineGraphComponent data={Categories} />*/}
			<div className="d-flex flex-row">
				<div className="input-group px-1">
				  <div className="input-group-prepend">
				    <label className="input-group-text font-small" htmlFor="inputGroupSelect01">
				    Timeline
				    </label>
				  </div>
				  <select className="custom-select font-small" id="inputGroupSelect01" onChange={e => handleChange(e.target.value, "timeline")}>
				    <option defaultValue value="">Choose...</option>
				    <option value="last_2_days">Last 2 days</option>
				    <option value="last_7_days">Last week</option>
				    <option value="last_30_days">Last month</option>
				  </select>
				</div>				
				<div className="input-group px-1">
				  <div className="input-group-prepend">
				    <label className="input-group-text font-small" htmlFor="inputGroupSelect01">
				    Category
				    </label>
				  </div>
				  <select className="custom-select font-small" id="inputGroupSelect01" onChange={e => handleChange(e.target.value, "category")}>
				    <option defaultValue value="">Choose...</option>
				    {
				    	surveysList.map(survey => (
				    		<option value={survey.id} key={survey.title}>{survey.title}</option>
				    	))
				    }
				  </select>
				</div>
			</div>
			{/*
				<label htmlFor="customRange1">{category.text} - {category.value}%</label>
				<input type="range" className="custom-range" id="customRange1" value={category.value} min="0" max="100"/>
			*/}
			{similarityResult && typeof(similarityResult) !== "string" ?
				(
					<div className="card p-4 mt-2">
						<div className="h5 text-center" dangerouslySetInnerHTML={{__html: similarityDescription}}>
						</div>
						<br/>
						<div className="h5 text-center text-secondary">Complete details</div>
						{
						similarityResult.map(sim => (
							<div key={sim.key}>{sim.key} - {sim.value}</div>
						))}
						<button className="btn btn-link btn-sm" onClick={e => clearInfo()}>Clear Info</button>
					</div>
				) : (
					<div className="card text-center p-2 mt-2 text-secondary">
						{!similarityResult ? 
							<div className="p-2">
								Do you want to check similarity with {selectedUser.displayName}? <br/>
								Choose a category from the above dropdown<br/>
								<span className="text-between-line">OR</span><br/>
								Start finding similarities by answering simple questions <br/>
		      			<button className="btn btn-link text-center" onClick={e => setGeneratePost(true)}>
		      			Answer now
		      			</button>
	      			</div>
	      			: 
	      			<div>
	      				{similarityResult} <br/>
								<button className="btn btn-link btn-sm" onClick={e => clearInfo()}>Clear</button>
	      			</div>
	      		}
					</div>
				)
			}
			{
				generatePost && <GeneratePostComponent setOpenModal={setGeneratePost} currentUser={currentUser} />
			}
		</div>
	)
}

const mapStateToProps = (state) => {
	const { surveysList } = state.surveys;
	return { surveysList };
}

export default connect(
	mapStateToProps, 
	null
)(SimilarityComponent);