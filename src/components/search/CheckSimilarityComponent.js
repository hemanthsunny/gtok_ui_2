import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";

import { getQuery, firestore } from "firebase_config";
import { ModalComponent } from "components";
import { SimilarityChecker } from "lib/api/SimilarityChecker";

const CheckSimilarityComponent = ({
	currentUser, setOpenModal, selectedUser, surveysList, redirectTo="search"
}) => {
	const [ similarityResult, setSimilarityResult ] = useState();
	const [ similarityDescription, setSimilarityDescription ] = useState();
	const [ selectedSurveyTitle, setSelectedSurveyTitle ] = useState("General");
	const history = useHistory();
	window.jQuery("#modal").modal("show");

	useEffect(() => {
	}, []);

	const getSimilarities = async (survey) => {
		let responses = await getQuery(
			firestore.collection("survey_responses").where("category", "==", survey.category).where("userId", "in", [currentUser.id, selectedUser.id]).get()
		);
		let result = "";
		if (responses.length === 2) {
			result = await SimilarityChecker(responses);
			setSimilarityResult(result.common);
		} else {
			result = selectedUser.displayName + " has not updated " + survey.title + " category yet";
			setSimilarityResult(result);
		}
		setSimilarityDescription(result.description);
		setSelectedSurveyTitle(survey.title);
	}

	getSimilarities({category: "general", title: "General"});

	const modalBody = () => {
		return (
			<div>
				{/*<LineGraphComponent data={Categories} />*/}
				<div className="d-flex flex-row">
				{
					surveysList.map((survey, idx) => (
						<button className={`btn btn-sm ${selectedSurveyTitle === survey.title ? "btn-primary" : "btn-outline-primary"}`} onClick={e => getSimilarities(survey)} key={idx}>{survey.title}</button>
					))
				}
				</div>
				{/*
					<label htmlFor="customRange1">{category.text} - {category.value}%</label>
					<input type="range" className="custom-range" id="customRange1" value={category.value} min="0" max="100"/>
				*/}
				{similarityResult && typeof(similarityResult) !== "string" ?
					(
						<div className="mt-3">
							<h6 className="text-primary text-center" dangerouslySetInnerHTML={{__html: similarityDescription}}>
							</h6>
							<br/>
							<h6 className="text-center font-bold">Complete details</h6>
							{
							similarityResult.map(sim => (
								<div key={sim.key}>{sim.key} - {sim.value}</div>
							))}
						</div>
					) : (
						<div className="text-center pt-2">
							{similarityResult}
						</div>
					)
				}
			</div>
		);
	}

	const onClose = () => {
		// surveyId = "";
		window.jQuery("#modal").modal("hide");
		history.push("/app/"+redirectTo);
	}
	return (
		<div>
			<ModalComponent body={modalBody} header={`Similarities with ${selectedUser.displayName}`} modelWidth="xl" close={onClose}/>
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
)(CheckSimilarityComponent);