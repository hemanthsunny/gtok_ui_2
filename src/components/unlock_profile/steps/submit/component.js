import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import moment from "moment";

import { add } from "firebase_config";

function SubmitComponent({save, cardDetails, price, paymentMethod, user, months, totalPrice, loading}) {
  const [ name, setName ] = useState("");
  const [ number, setNumber ] = useState("");
  const [ expiryMonth, setExpiryMonth ] = useState("");
  const [ expiryYear, setExpiryYear ] = useState("");
  const [ cvv, setCvv ] = useState("");
	const [ result, setResult ] = useState({});
  const history = useHistory();

  const cancelOrder = () => {
    if (window.confirm("Are you sure to cancel this order?")) {
      history.push({
				pathname: `/app/profile/${user.id}`
			});
    }
  }

	return (
	  <div className="container invoice-wrapper">
      <div className="purchase-order">
        <div className="section-header">Purchase order</div>
        <div>
          <div className="form-group row">
            <div className="col-7 label">Profile name</div>
            <div className="col-5 value">{user.displayName}</div>
          </div>
          <div className="form-group row">
            <div className="col-7 label">Price per month</div>
            <div className="col-5 value">{price.amount}</div>
          </div>
          <div className="form-group row">
            <div className="col-7 label">Total months</div>
            <div className="col-5 value">{months}</div>
          </div>
          <div className="form-group row">
            <div className="col-7 label">Total cost</div>
            <div className="col-5 value">INR {totalPrice}/-</div>
          </div>
          <div className="form-group row">
            <div className="col-7 label">Valid from</div>
            <div className="col-5 value">{moment().format("DD-MM-YYYY")}</div>
          </div>
          <div className="form-group row">
            <div className="col-7 label">Valid till</div>
            <div className="col-5 value">{moment().add(months*30, 'd').format("DD-MM-YYYY")}</div>
          </div>
          <div className="form-group row">
            <div className="col-7 label">Unlock validity</div>
            <div className="col-5 value">{months * 30} days</div>
          </div>
        </div>
      </div>
      <hr/>
      <div className="payment-details">
        <div className="section-header">Payment details</div>
        <div>
          <div className="form-group row">
            <div className="col-12 label">Card number</div>
            <div className="col-12 value">{cardDetails.number}</div>
          </div>
          <div className="form-group row">
            <div className="col-12 label">Name on card</div>
            <div className="col-12 value">{cardDetails.name}</div>
          </div>
          <div className="form-group row">
            <div className="col-12 label">Expiry date</div>
            <div className="col-12 value">{cardDetails.expiryMonth}/{cardDetails.expiryYear}</div>
          </div>
          <div className="form-group row">
            <div className="col-12 label">CVV</div>
            <div className="col-12 value">&middot;&middot;&middot;</div>
          </div>
        </div>
      </div>
      <div className="py-3">
        <button className="btn btn-next" onClick={cancelOrder} disabled={loading}>
          Cancel
        </button>
        <button className="btn btn-next pull-right" onClick={save} disabled={loading}>
          Confirm
        </button>
      </div>
		</div>
	);
}

export default SubmitComponent;
