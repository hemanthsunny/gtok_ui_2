import React from "react";

function DuplicateWalletComponent({ save, requestSent }) {
	return (
	  <div className="text-center duplicate-wallet-wrapper">
      Apologies! Your wallet is temporarily locked.
      { requestSent ?
        <div className="btn btn-next py-3">
          Your unlock request is in process. You'll receive an update within 24 hours.
        </div> :
        <div className="btn btn-next" onClick={save}>
          Request to unlock
        </div>
      }
		</div>
	);
}

export default DuplicateWalletComponent;
