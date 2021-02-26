import React, { useState } from "react";

function PaymentMethodComponent({setStepNumber, paymentMethod, setPaymentMethod}) {
  const goBack = () => {
    setStepNumber(1);
  }

  const goNext = () => {
    if (!paymentMethod) {
      alert("Select a payment method");
      return null;
    }
    setStepNumber(3);
  }

	return (
	  <div className="container payment-method-wrapper">
      <div className="header">Pay by</div>
      <div className="col-12 py-3 d-none">
        <input type="radio" name="payment_method" id="pm2" onChange={e => setPaymentMethod("wallet")} checked={paymentMethod === "wallet"} />
        <label htmlFor="pm2">Wallet</label>
      </div>
      <div className="col-12 pb-3">
        <input type="radio" name="payment_method" id="pm1" onChange={e => setPaymentMethod("card")} checked={paymentMethod === "card"} />
        <label htmlFor="pm1">Credit/Debit Card</label>
      </div>
      <div className="py-3">
        <button className="btn btn-next" onClick={goBack}>
          Back
        </button>
        <button className="btn btn-next pull-right" onClick={goNext}>
          Next
        </button>
      </div>
		</div>
	);
}

export default PaymentMethodComponent;
