import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import HeaderComponent from "./header";

import { add } from "firebase_config";

function AddPaymentCardComponent({ currentUser }) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [result, setResult] = useState({});
  const history = useHistory();

  const handleChange = (key, val) => {
    if (key === "number") {
      if (val.length <= 16) {
        setNumber(val);
      }
    }
    if (key === "name") {
      setName(val);
    }
    if (key === "expiryMonth") {
      if (val.length <= 2) {
        setExpiryMonth(val);
      }
    }
    if (key === "expiryYear") {
      if (val.length <= 2) {
        setExpiryYear(val);
      }
    }
    if (key === "cvv") {
      const cv = val.match("^[0-9]+$");
      if (cv && val.length <= 3) {
        setCvv(val);
      }
    }
  };

  const saveCard = async () => {
    if (!number || number.length !== 16 || !number.match("^[0-9]+$")) {
      alert("Invalid card number");
      return null;
    }
    if (!name || !name.match("^[a-z A-Z]+$")) {
      alert("Name is mandatory");
      return null;
    }
    if (!expiryMonth || !expiryYear) {
      alert("Invalid expiry date");
      return null;
    }
    if (!cvv || cvv.length !== 3) {
      alert("Invalid CVV code");
      return null;
    }

    const data = {
      name,
      number,
      expiryMonth,
      expiryYear,
      cvv,
      userId: currentUser.id,
    };
    const result = await add("paymentCards", data);
    /* Log the activity */
    // await add('logs', {
    //   text: `${currentUser.displayName} posted an activity`,
    //   userId: currentUser.id,
    //   collection: 'paymentCards',
    //   timestamp
    // });
    if (result.status === 200) {
      history.push({
        pathname: "/app/settings/payment_cards",
        state: { added: true, reloadCards: true },
      });
    } else {
      setResult(result);
    }
  };

  return (
    <div>
      <HeaderComponent save={saveCard} />
      <div className="container add-card-wrapper">
        <div className="form-group row">
          <label htmlFor="cardNumber" className="col-sm-4 form-label">
            Card number
          </label>
          <div className="col-sm-8">
            <input
              type="number"
              className="form-control"
              id="cardNumber"
              value={number}
              placeholder="4678XXXXXXXXXXXX"
              onChange={(e) => handleChange("number", e.target.value)}
              maxLength="16"
              pattern="([0-9]|[0-9]|[0-9])"
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="cardName" className="col-sm-4 form-label">
            Name on card
          </label>
          <div className="col-sm-8">
            <input
              type="text"
              className="form-control text-uppercase"
              id="cardName"
              value={name}
              placeholder="Jame Morris"
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="cardExpiryDate" className="col-sm-4 form-label">
            Expiry date
          </label>
          <div className="col-12 row">
            <div className="col-4">
              <input
                type="number"
                className="form-control"
                id="cardExpiryDate"
                value={expiryMonth}
                placeholder="MM"
                onChange={(e) => handleChange("expiryMonth", e.target.value)}
                maxLength="2"
                required
              />
            </div>
            <div className="col-1">/</div>
            <div className="col-4">
              <input
                type="number"
                className="form-control"
                id="cardExpiryDate"
                value={expiryYear}
                placeholder="YY"
                onChange={(e) => handleChange("expiryYear", e.target.value)}
                maxLength="2"
                required
              />
            </div>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="cardCvv" className="col-sm-4 form-label">
            CVV
          </label>
          <div className="col-sm-8">
            <input
              type="password"
              className="form-control"
              id="cardCvv"
              value={cvv}
              placeholder="3-digit code"
              onChange={(e) => handleChange("cvv", e.target.value)}
              maxLength="3"
              pattern="([0-9]|[0-9]|[0-9])"
              required
            />
          </div>
        </div>
        <div className="text-center">
          {result.status && (
            <div
              className={`text-${
                result.status === 200 ? "success" : "danger"
              } mb-2`}
            >
              {result.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddPaymentCardComponent;
