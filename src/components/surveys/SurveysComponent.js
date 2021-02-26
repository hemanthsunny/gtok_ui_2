import React, { useState, useEffect } from "react";
import { useHistory, Link } from 'react-router-dom';
import { connect } from "react-redux";

import { getQuery, remove, update, firestore } from "firebase_config";
import { NotificationComponent, LoadingComponent } from "components";
import { SetSurveysList } from "store/actions";

const SurveysComponent = ({
	currentUser, redirectTo={}, surveysList, bindSurveysList
}) => {
	const [ result, setResult ] = useState({});
	const [ filledSurveysList, setFilledSurveysList ] = useState([]);
	const [ refresh, setRefresh ] = useState(false);
	const [ loading, setLoading ] = useState(true);
	const history = useHistory();

	useEffect(() => {
		window.jQuery('[data-toggle="popover"]').popover();
		async function getFilledSurveys() {
			let responses = await getQuery(firestore.collection('survey_responses').where("userId", "==", currentUser.id).get());
			let surveyIds = [];
			for (let r of responses) {
				surveyIds.push(r.survey_id);
			}
			setFilledSurveysList(surveyIds);
			setLoading(false);
		}
		getFilledSurveys();
	}, [refresh, currentUser]);

	const openSurveyModal = async (id, survey={}) => {
		if (isSurveyFilled(id) && !currentUser.admin && id !== "new") {
			return alert(survey.title + " category is completed. Try another category.")
		}
		history.push({
			pathname: '/app/similarities/'+id,
			state: { redirectTo }
		});
	}

	const editSurvey = async (id) => {
		history.push({
			pathname: '/app/similarities/'+id,
			search: `?edit=true`
		});
	}

	const removeSurvey = async (id) => {
		if (window.confirm("Are you sure to delete survey & it's responses?")) {		
			setResult({
				status: 100,
				message: 'Processing...'
			});
			let res = await remove('surveys', id);
			setResult(res);
			setRefresh(!refresh);
		}
	}

	const isSurveyFilled = (id) => {
		return !!filledSurveysList.find(i => i === id);
	}

	const setSurveyStatus = async (survey) => {
		survey["active"] = !survey.active;
		await update("surveys", survey.id, {active: survey.active});
		await bindSurveysList(currentUser);
	}

	return (
    <div className="container p-3">
	  	{
	  		result.status && <NotificationComponent result={result} setResult={setResult} />
	  	}
      <h6 className="text-center text-secondary">
      	To find similarities or to generate a post, you need to answer few questions in each category. &nbsp;
      	<i className="fa fa-info-circle" data-container="body" data-toggle="popover" data-placement="right" data-content="Categories include Daily needs, Profession, Help, Fashion, Food habits, Health & more"></i> <br/>
      </h6>
      {	currentUser.admin && 
      	<div className="d-flex align-content-end mt-4">
				  <button className="btn btn-danger" onClick={e => openSurveyModal('new')}>
					  <i className="fa fa-plus"></i> Add a survey
					</button>
					<Link to="/assets/files/SurveyTemplate.txt" target="_blank" download>
				  <button className="btn btn-danger ml-2 mt-xs-2 mt-md-0">
					  <i className="fa fa-download"></i> Download survey template
					</button>
					</Link>
				</div>
      }
      <div className="container mt-4">
	      <div className="row">
		  		{surveysList && surveysList.map((survey, idx) => {
		  			return (!currentUser.admin) ? survey.active && (
							<div key={idx}>
					      <button className={`btn btn-sm ${isSurveyFilled(survey.id) ? "btn-primary" : "btn-outline-primary"}`} onClick={e => openSurveyModal(survey.id, survey)} data-target="#modal" data-toggle="modal">
								  {survey.title}
								</button> &nbsp;
							</div>
			  		) : (
							<div key={idx} className="col-xs-12 col-sm-6">
								<div className="">
								  <input className="form-check-input" type="checkbox" name={idx} id={survey.id} checked={survey.active} onChange={e => setSurveyStatus(survey)}/>
								  <label htmlFor={idx}>
							      <button className={`btn btn-sm ${isSurveyFilled(survey.id) ? "btn-primary" : "btn-outline-primary"}`} onClick={e => openSurveyModal(survey.id, survey)} data-target="#modal" data-toggle="modal">
										  {survey.title}
										</button> &nbsp;
										<button className="btn btn-sm btn-primary" onClick={e => editSurvey(survey.id)} title="Edit survey">
										<i className="fa fa-pencil"></i>
										</button>
										&nbsp;
										<button className="btn btn-sm btn-danger" onClick={e => removeSurvey(survey.id)} title="Remove survey">
											<i className="fa fa-trash"></i>
										</button>
									</label>
					      	{survey.mandatory && 
					      		<button className="btn btn-sm">
						      		<i className="fa fa-star text-danger"></i>
						      	</button>
					      	}
					      </div>
							</div>
			  		)
			  	})}
		  	</div>
		  </div>
	  	{ loading && <LoadingComponent />	}
    </div>
  );
};

const mapStateToProps = (state) => {
	const { surveysList } = state.surveys;
	return { surveysList };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindSurveysList: (content) => dispatch(SetSurveysList(content))
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(SurveysComponent);