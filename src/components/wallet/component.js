import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import "./style.css";

import { LoadingComponent } from "components";

import { getQuery, firestore } from "firebase_config";
import WalletDetailsComponent from "./steps/wallet_details/component";

// https://stackoverflow.com/questions/41658552/how-to-create-a-7-character-underline-input-text-field-in-html-and-cssscreensho
// https://stackoverflow.com/questions/41698357/how-to-partition-input-field-to-appear-as-separate-input-fields-on-screen

function WalletComponent({ currentUser, wallet }) {
  const [loading, setLoading] = useState(true);
  const [walletDetails, setWalletDetails] = useState("");
  const history = useHistory();

  useEffect(() => {
    async function getWalletDetails() {
      const wallet = await getQuery(
        firestore
          .collection("wallets")
          .where("userId", "==", currentUser.id)
          .get()
      );
      if (wallet.length === 1) {
        setWalletDetails(wallet[0]);
      } else if (wallet.length > 1) {
        alert("You have more than 1 wallet accounts");
      } else {
        history.push("/app/change_passcode");
      }
    }

    if (!walletDetails) {
      getWalletDetails();
    }
    setLoading(false);
  }, [setLoading]);

  return (
    <div className="wallet-wrapper">
      <div className="dashboard-content">
        {loading ? (
          <LoadingComponent />
        ) : (
          <div>
            <WalletDetailsComponent
              wallet={walletDetails}
              currentUser={currentUser}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { wallet } = state.wallet;
  return { wallet };
};

export default connect(mapStateToProps, null)(WalletComponent);
