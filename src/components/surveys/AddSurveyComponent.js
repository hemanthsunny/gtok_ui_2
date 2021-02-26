import React, { useState, useEffect } from "react";
import { useHistory, withRouter } from 'react-router-dom';
import { add } from "firebase_config";
import { ModalComponent, NotificationComponent } from "components";
import { convertTextToJson } from "helpers";

const AddSurveyComponent = (props) => {
	const { currentUser } = props;
	const [ surveyText, setSurveyText ] = useState("");
	const [ btnSave, setBtnSave ] = useState("Save");
	const [ result, setResult ] = useState({});
	const [ mandatory, setMandatory ] = useState(false);
	const query = new URLSearchParams(props.location.search);
	let newSurvey = query.get("newSurvey");
	const history = useHistory();

	useEffect(() => {
		window.jQuery("#modal").modal("show");
	}, [newSurvey]);

	const onClose = () => {
		newSurvey = "";
		window.jQuery("#modal").modal("hide");
		history.push("/app/surveys");
	}

	const modalBody = () => (
		<div>
			<div className="d-flex bd-highlight">
		    <div className="p-1 bd-highlight">
		      <input type="checkbox" className="form-input" id="userName" value={mandatory} onChange={e => setMandatory(e.target.value)} />
		    </div>
		    <label htmlFor="userName" className="p-1 bd-highlight col-form-label">Mandatory</label>
		  </div>
	    <textarea className="survey-textbox" rows={15} placeholder="Survey details..." onChange={e => setSurveyText(e.target.value)}></textarea>
    </div>
	);

	const onSave = async (e) => {
		if (!currentUser.admin) { history.push('/error') }
		setBtnSave("Saving...");
		setResult({
			status: 100,
			message: 'Processing...'
		});

		let data = convertTextToJson(surveyText);
		data["_original_text"] = surveyText;

		if (mandatory) {
			data['mandatory'] = true
		}
		let res = await add('surveys', data);
		setResult(res);
		setBtnSave("Saved!");
		props.setRefresh(!props.refresh);
		onClose();
	}

	return (
		<div>
	  	{
	  		result.status ? <NotificationComponent result={result} setResult={setResult} /> : ''
	  	}
	  	{ newSurvey === 'true' ?
				<ModalComponent body={modalBody} header="Add a new survey" btnSave={btnSave} save={onSave} close={onClose} />
				: ''
			}
		</div>
	)
}

export default withRouter(AddSurveyComponent);