import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./style.css";

import HeaderComponent from "./header";
import CheckoutComponent from "./steps/checkout/component";
import CardDetailsComponent from "./steps/card_details/component";
import { LoadingComponent } from "components";
import { post } from "services";

function WalletRechargeComponent({ currentUser }) {
  const [rechargeAmount, setRechargeAmount] = useState(50);
  const [stepNumber, setStepNumber] = useState(1);
  const [paymentIntent, setPaymentIntent] = useState("");
  const [parentLoading, setParentLoading] = useState(false);
  const history = useHistory();

  const cancelPaymentIntent = async () => {
    if (paymentIntent.id) {
      setParentLoading(true);
      await post("/transaction/cancel", {
        paymentIntentId: paymentIntent.id,
      });
      setParentLoading(false);
    }
  };

  const goBack = async () => {
    if (stepNumber === 2 && paymentIntent.id) {
      if (window.confirm("Are you sure you want to go back?")) {
        await cancelPaymentIntent();
        history.push("/app/wallet");
      }
    } else {
      history.push("/app/wallet");
    }
  };

  return (
    <div>
      <HeaderComponent goBack={goBack} />
      <div className="dashboard-content -xs-bg-none pt-md-1">
        <div className="wallet-recharge-wrapper">
          {parentLoading ? (
            <LoadingComponent />
          ) : (
            <div>
              {stepNumber === 1 && (
                <CheckoutComponent
                  currentUser={currentUser}
                  rechargeAmount={rechargeAmount}
                  setRechargeAmount={setRechargeAmount}
                  setStepNumber={setStepNumber}
                  paymentIntent={paymentIntent}
                  setPaymentIntent={setPaymentIntent}
                  cancelPaymentIntent={cancelPaymentIntent}
                />
              )}
              {stepNumber === 2 && (
                <CardDetailsComponent
                  currentUser={currentUser}
                  rechargeAmount={rechargeAmount}
                  setStepNumber={setStepNumber}
                  paymentIntent={paymentIntent}
                  cancelPaymentIntent={cancelPaymentIntent}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WalletRechargeComponent;

// Ref: https://stackoverflow.com/questions/55156572/how-to-give-automatic-spaces-in-credit-card-validation-slash-in-a-date-format-v
