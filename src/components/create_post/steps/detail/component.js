import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import { AudioPlayerComponent } from "components";
import { specialCategory } from "constants/categories";

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
  sharePost,
  postLength,
  setPostLength,
  resharePost,
  resharePostUser,
  createResharePost,
}) => {
  const tradePriceMinimum = 10;
  const tradePriceMaximum = 10000;

  const handleChange = async (val) => {
    setPostText(val);
    setPostLength(30 - val.length);
  };

  const handleAnonymousChange = () => {
    setTradePost(false);
    setAnonymous(!anonymous);
  };

  return (
    <div className="mt-sm-3">
      <div className="card create-post-card-wrapper">
        <div className="card-body">
          {createResharePost && (
            <div>
              <div>
                <span
                  className={`card-badge ${
                    resharePost.category.key === "special" &&
                    "card-badge-special"
                  }`}
                >
                  {resharePost.category.title}
                </span>
                <span
                  className={`card-amount ${
                    !resharePost.tradePrice && "d-none"
                  } pl-2`}
                >
                  <span className="currency-text">
                    <img
                      className="inr-black-icon p-0"
                      src={
                        require("assets/svgs/currency/inr/inr_black.svg")
                          .default
                      }
                      alt="1"
                    />
                    {resharePost.tradePrice}
                  </span>
                </span>
                <span className="created-at">
                  {moment(resharePost.createdAt).format("h:mm a")} &middot;{" "}
                  {moment(resharePost.createdAt).format("D MMM 'YY")}
                </span>
              </div>
              <div className="clearfix"></div>
              <p className="mt-3 mb-2">
                {resharePost.stories[0].text}
                {resharePost.stories[0].fileUrl && (
                  <AudioPlayerComponent
                    fileUrl={resharePost.stories[0].fileUrl}
                  />
                )}
              </p>
              <div className="author text-violet">
                {resharePost.anonymous ? (
                  <span>@anonymous</span>
                ) : (
                  <span>@{resharePostUser.username}</span>
                )}
              </div>
              <hr />
            </div>
          )}
          <div className="">
            {createResharePost ? (
              <span className="card-badge">same pinch</span>
            ) : (
              <button
                className={`card-badge ${
                  category.key === "special" && "card-badge-special"
                }`}
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
            )}
            <span
              className={`${
                tradePost && !createResharePost ? "ml-2" : "d-none"
              }`}
            >
              <img
                src={require("assets/svgs/currency/inr_black.svg").default}
                className="inr-black-icon p-0"
                alt="Inr"
              />
              {tradePrice}
            </span>
          </div>
          <textarea
            className="create-post-box"
            value={postText}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={
              category.key === "special"
                ? specialCategory.description
                : "Do you know? Feelings are assets. Start sharing.."
            }
            rows={7}
            autoFocus
          ></textarea>
          <div className={`text-center ${postLength < 1 && "d-none"}`}>
            <small className="text-grey pb-5">
              Atleast {postLength} chars required
            </small>
          </div>
        </div>
        <div className="card-footer">
          {anonymous ? (
            <span className="author">@anonymous</span>
          ) : (
            <span className="author">@{currentUser.username}</span>
          )}
          <div className="edit-options">
            {createResharePost ? (
              <div className="mb-4 pb-2"></div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
      {!createResharePost && (
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
            {fileUrl && (
              <AudioPlayerComponent
                fileUrl={fileUrl}
                postId="newAssetAudio"
                storyId="0"
              />
            )}
          </div>
          <hr className="mt-2" />
          {wallet && wallet[0] ? (
            <div
              className={`trade-section-wrapper ${anonymous && "-disabled"}`}
            >
              <div className="d-flex flex-row">
                <div className="flex-grow-1">
                  <img
                    src={
                      require("assets/svgs/login/right_lock_icon.svg").default
                    }
                    className="attachment-icon"
                    alt="Audio"
                  />{" "}
                  &nbsp;
                  <span className="option-name" htmlFor="customSwitch1">
                    Trade asset
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
                      src={
                        require("assets/svgs/currency/inr_black.svg").default
                      }
                      className="inr-black-icon"
                      alt="Inr"
                    />
                    {tradePriceMinimum}
                  </span>
                  <span>
                    <img
                      src={
                        require("assets/svgs/currency/inr_black.svg").default
                      }
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
          {/* Assets */}
          <div className="pl-3 font-small text-grey">
            *Assets can't be deleted once they've been created.
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailComponent;
