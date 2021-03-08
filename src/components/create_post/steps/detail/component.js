import React, { useState } from "react";

const DetailComponent = ({ setStepNumber, postText, setPostText, btnUpload, fileUrl, uploadAudio, deleteFile }) => {
  const [ alert, setAlert ] = useState(null);

  const handleChange = async (val) => {
    setPostText(val);
  }

  const goNext = () => {
    if (!postText) {
      setAlert("Add few words here");
      return null;
    }
    setStepNumber(2);
  }

  return (
    <div className="container feeling-detail-wrapper">
      <div className="audio">
        <div className="header pull-left">Upload / Record</div>
        <div className="">
          <label htmlFor="staticAudioFile" className="pull-right">
          {
            btnUpload === "Upload" ?
              !fileUrl &&
              <img src={require(`assets/svgs/Microphone.svg`).default} className="audio-icon" alt="Audio" />
            : <div className="font-small"><i className="fa fa-spinner fa-spin"></i> {btnUpload !== "Upload" && btnUpload}</div>
          }
          </label>
          <input type="file" className="form-control-plaintext d-none" id="staticAudioFile" onChange={e => uploadAudio(e.target.files[0])} accept="audio/*" />

          {
            fileUrl &&
            <div>
              <img src={require(`assets/svgs/Trash.svg`).default} className="trash-icon pull-right" alt="Remove" onClick={deleteFile} />
              <audio src={fileUrl} controls controlsList="nodownload" />
            </div>
          }
        </div>
      </div>
      <div className="clearfix"></div>
      <div className="description">
        <div className="header">Type here <small className="text-danger">*{alert}</small></div>
        <textarea className="form-control" value={postText} onChange={e => handleChange(e.target.value)} placeholder="Share your experience" rows={4}></textarea>
      </div>

      <button className="btn btn-next pull-right" onClick={goNext}>
        Next
      </button>
		</div>
  );
};

export default DetailComponent;
