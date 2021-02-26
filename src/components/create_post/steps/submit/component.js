import React, { useState } from "react";

const SubmitComponent = ({ save, setStepNumber }) => {
  const [ premium, setPremium ] = useState(false);

  const submit = async () => {
    await save({premium});
  }

  const goBack = () => {
    setStepNumber(2);
  }

  return (
    <div className="container feeling-submit-wrapper">
      <div>
        Make it as premium
        <img src={premium ? require(`assets/svgs/CheckboxActive.svg`) : require(`assets/svgs/Checkbox.svg`)} className="checkbox-icon pull-right" alt="Premium" onClick={e => setPremium(!premium)} />
      </div>
      <button className="btn btn-next my-3" onClick={goBack}>
        Back
      </button>
      <button className="btn btn-next my-3 pull-right" onClick={submit}>
        Save
      </button>
		</div>
  );
};

export default SubmitComponent;
