import React, { useState } from "react";

const ActivityDescriptionComponent = ({ description, setDescription, setStepNumber }) => {
  const [ localVar, setLocalVar ] = useState(description);

  const handleChange = (val) => {
    // val = val && val.trim();
    setLocalVar(val);
  }

  const saveDescription = async () => {
    await setDescription(localVar);
    setStepNumber(4);
  }

  const goBack = () => {
    setStepNumber(2);
  }

  return (
    <div className="container activity-detail-wrapper">
      <div className="mb-3">
        <div className="mb-3 header">Add anything else?</div>
        <textarea className="form-control" value={localVar} onChange={e => handleChange(e.target.value)} placeholder="Keep it short and sweet" rows={4}></textarea>
      </div>
      <button className="btn btn-submit" onClick={goBack}>
        Back
      </button>
      <button className="btn btn-submit pull-right" onClick={saveDescription}>
        Next
      </button>
		</div>
  );
};

export default ActivityDescriptionComponent;
