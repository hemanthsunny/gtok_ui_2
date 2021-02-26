import React, { useState } from "react";
const ActivityDetails = {
  "cooking": {
    placeholder: "Now, what are you cooking?"
  },
  "playing": {
    opts: ["Game", "Video Game", "Other"],
    placeholder: "Now, what are you playing?"
  },
  "reading": {
    opts: ["Book", "Novel", "Other"],
    placeholder: "Now, what are you reading?"
  },
  "watching": {
    opts: ["Movie", "Video", "Other"],
    placeholder: "Now, what are you watching?"
  },
  "sleeping": {
    opts: ["Angry", "Happy", "Sad", "Other"],
    placeholder: "Before going to bed, how is your mood?"
  }
};

const ActivityDetailComponent = ({ name, detail, setDetail, setStepNumber }) => {
  const [ localVar, setLocalVar ] = useState(detail);
  const [ other, setOther ] = useState(false);
  const [ alert, setAlert ] = useState(null);
  const detailOpts = ActivityDetails[name];

  const handleChange = (val) => {
    // let wordcount = val.split(" ");
    if (!val) {
      setAlert("Compulsory field");
      return null;
    }

    if (val === "Other") {
      setOther(true);
      setLocalVar(null);
    } else {
      setLocalVar(val);
    }
  }

  const saveName = () => {
    setDetail(localVar.toLowerCase());
    setStepNumber(3);
  }

  const goBack = () => {
    setStepNumber(1);
  }

  return (
    <div className="container activity-detail-wrapper">
      {
        detailOpts && detailOpts.opts ?
        <div>
          <div className="header">{detailOpts.placeholder}</div>
          <div className="options row">
            {detailOpts.opts && detailOpts.opts.map((val, idx) => (
              <div key={idx} className="col-6">
                <input type="radio" name="activity_name" id={`rd${idx}`} onChange={e => handleChange(val)} checked={val === localVar} />
                <label htmlFor={`rd${idx}`}>{val}</label>
              </div>
            ))}
            {
              other &&
              <textarea className="form-control" onChange={e => handleChange(e.target.value)} placeholder="Keep it short and sweet" rows={4}></textarea>
            }
          </div>
        </div> :
        <div className="mb-3">
          <div className="mb-3 header">What are you <b>{name}</b>?</div>
          <textarea className="form-control" onChange={e => handleChange(e.target.value)} placeholder="Keep it short and sweet" rows={4}></textarea>
        </div>
      }
      <small className="text-danger">{alert}</small>
      <button className="btn btn-submit" onClick={goBack}>
        Back
      </button>
      <button className={`btn btn-submit pull-right ${(!localVar || alert) && "d-none"}`} onClick={saveName}>
        Next
      </button>
		</div>
  );
};

export default ActivityDetailComponent;
