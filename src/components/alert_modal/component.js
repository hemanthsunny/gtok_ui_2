import React from "react";

const AlertComponent = ({ currentUser, template }) => {
  // const closeModal = () => {
  //   $('#withdrawConfimationModal').hide()
  //   $('.modal-backdrop').remove()
  //   $('body').removeClass('modal-open')
  // }

  return (
    <div
      className="modal fade"
      id="alertModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="alertModalLabel"
      aria-hidden="true"
      data-backdrop="static"
      data-keyboard="false"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body pt-0">
            <div className="text-center">
              <img
                className="btn-play"
                src={require("assets/svgs/Accessibility.svg").default}
                alt="1"
              />
            </div>
            {template()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertComponent;
