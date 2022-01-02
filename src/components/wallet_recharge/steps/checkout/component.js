import React, { useState } from "react";
import { toast } from "react-toastify";

import { post } from "services";

function CheckoutComponent({
  rechargeAmount,
  setRechargeAmount,
  setPaymentIntent,
  setStepNumber,
}) {
  const [loading, setLoading] = useState(false);

  const saveCheckout = async () => {
    if (rechargeAmount < 50) {
      toast.error("Minimum amount to recharge is INR 50/-");
      return null;
    }
    setLoading(true);
    const res = await post("/transaction/checkout", {
      amount: rechargeAmount,
    });
    if (res.status === 201) {
      setPaymentIntent(res.data.data);
      setStepNumber(2);
    }
    setLoading(false);
  };

  return (
    <div className="change-pc-wrapper enter-passcode-section">
      <div className="form-group">
        <label className="form-label">Recharge amount</label>
        <div className="passcode-card">
          <input
            type="number"
            className="passcode-input"
            placeholder="50"
            onChange={(e) => setRechargeAmount(e.target.value)}
            value={rechargeAmount}
          />
        </div>
      </div>
      <button
        className="btn btn-sm btn-violet-rounded col-5"
        onClick={saveCheckout}
        disabled={loading}
      >
        {loading ? (
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <span>Next</span>
        )}
      </button>
    </div>
  );
}

export default CheckoutComponent;
