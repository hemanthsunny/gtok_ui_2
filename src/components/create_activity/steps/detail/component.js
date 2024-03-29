import React from "react";
import { Link } from "react-router-dom";

import { AudioPlayerComponent } from "components";

const DetailComponent = ({
  setStepNumber,
  postText,
  setPostText,
  btnUpload,
  fileUrl,
  uploadAudio,
  deleteFile,
  currentUser,
  category,
  tradePrice,
  setTradePrice,
  anonymous,
  setAnonymous,
  tradePost,
  setTradePost,
  wallet,
}) => {
  const tradePriceMinimum = 10;
  const tradePriceMaximum = 10000;

  const handleChange = async (val) => {
    setPostText(val);
  };

  const handleAnonymousChange = () => {
    setTradePost(false);
    setAnonymous(!anonymous);
  };

  return (
    <div>
      <div className="card create-post-card-wrapper">
        <div className="card-body">
          <div className="d-flex flex-row align-items-center">
            <button
              className="card-badge"
              data-target="#selectPostCategoryModal"
              data-toggle="modal"
            >
              {category.title}{" "}
              <img
                className="icon-angle-down"
                src={require("assets/svgs/AngleDown.svg").default}
                alt="1"
              />
            </button>
            <span className={`${tradePost ? "ml-2" : "d-none"}`}>
              <img
                src={require("assets/svgs/currency/inr_black.svg").default}
                className="inr-black-icon"
                alt="Inr"
              />
              {tradePrice}
            </span>
          </div>
          <textarea
            className="create-post-box"
            value={postText}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Hi der! type here about your activity!!"
            rows={7}
            autoFocus
          ></textarea>
        </div>
        <div className="card-footer">
          {anonymous ? (
            <span className="author">@anonymous</span>
          ) : (
            <span className="author">@{currentUser.username}</span>
          )}
          <div className="edit-options">
            <button
              className="btn btn-link btn-heart"
              onClick={handleAnonymousChange}
            >
              {anonymous ? (
                <img
                  className="icon-heart icon-heart"
                  src={require("assets/svgs/EyeballClosed.svg").default}
                  alt="1"
                />
              ) : (
                <img
                  className="icon-heart icon-heart"
                  src={require("assets/svgs/Eyeball.svg").default}
                  alt="1"
                />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="mt-4 attachment">
          <label htmlFor="staticAudioFile" className="w-100-p">
            <div className="d-flex">
              <div className="flex-grow-1">
                <img
                  src={require("assets/svgs/Microphone.svg").default}
                  className="microphone-icon"
                  alt="Audio"
                />
                <span className="pl-2">
                  {btnUpload === "upload" ? (
                    fileUrl ? (
                      <span>Audio attached</span>
                    ) : (
                      <span>Attach audio</span>
                    )
                  ) : (
                    <span>
                      {" "}
                      Uploading... <i className="fa fa-spinner fa-spin"></i>
                    </span>
                  )}
                </span>
              </div>
              <div className={`${!fileUrl && "d-none"}`}>
                <img
                  src={require("assets/svgs/Trash.svg").default}
                  className="microphone-icon"
                  alt="Trash"
                  onClick={deleteFile}
                />
              </div>
            </div>
          </label>
          <input
            type="file"
            className="form-control-plaintext d-none"
            id="staticAudioFile"
            onChange={(e) => uploadAudio(e.target.files[0])}
            accept="audio/*"
          />
          {fileUrl && <AudioPlayerComponent fileUrl={fileUrl} />}
        </div>
        <hr className="mt-2" />
        {wallet && wallet[0] ? (
          <div className={`trade-section-wrapper ${anonymous && "-disabled"}`}>
            <div className="d-flex flex-row">
              <div className="flex-grow-1">
                <img
                  src={require("assets/svgs/login/right_lock_icon.svg").default}
                  className="attachment-icon"
                  alt="Audio"
                />{" "}
                &nbsp;
                <span className="option-name" htmlFor="customSwitch1">
                  Trade post
                </span>
              </div>
              <div className="custom-control custom-switch">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="private"
                  onChange={(e) => setTradePost(!tradePost)}
                  checked={tradePost || false}
                  disabled={anonymous}
                />
                <label
                  className="custom-control-label"
                  htmlFor="private"
                ></label>
              </div>
            </div>
            <div className={`${tradePost ? "slider-block mt-3" : "d-none"}`}>
              <div className="text-center">
                <img
                  src={require("assets/svgs/currency/inr_black.svg").default}
                  className="inr-black-icon"
                  alt="Inr"
                />
                {tradePrice}
              </div>
              <input
                type="range"
                value={tradePrice}
                step="5"
                className="range"
                min="10"
                max="10000"
                onChange={(e) => setTradePrice(e.target.value)}
              />
              <div className="d-flex flex-row justify-content-between">
                <span>
                  <img
                    src={require("assets/svgs/currency/inr_black.svg").default}
                    className="inr-black-icon"
                    alt="Inr"
                  />
                  {tradePriceMinimum}
                </span>
                <span>
                  <img
                    src={require("assets/svgs/currency/inr_black.svg").default}
                    className="inr-black-icon"
                    alt="Inr"
                  />
                  {tradePriceMaximum}
                </span>
              </div>
              <div className="text-center">Choose your trade amount</div>
            </div>
          </div>
        ) : (
          <div className="text-center font-small">
            <Link to="/app/change_passcode" className="text-violet">
              {" "}
              Create a wallet passcode{" "}
            </Link>{" "}
            to start trading.
          </div>
        )}
        <hr className="" />
      </div>
    </div>
  );
};

export default DetailComponent;
