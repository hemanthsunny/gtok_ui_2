import React from "react";

function CalculatePriceComponent({user, price, months, setMonths, totalPrice, setTotalPrice, setStepNumber}) {
  const handleMonths = (val) => {
    setMonths(val);
    let tp;
    if (!val) {
      tp = months * price.amount
    } else {
      tp = val * price.amount
    }
    setTotalPrice(tp);
  }

  const goNext = () => {
    if (months < 1) {
      alert("Atleast 1 month is required");
      return null;
    }
    setStepNumber(2);
  }

	return (
	  <div className="container calculate-price-wrapper">
      <div className="form-group row per-month">
        <div className="col-9 label">Price per month</div>
        <div className="col-3 value">{price.amount}</div>
      </div>
      <div className="form-group row total-months">
        <label htmlFor="price" className="col-9 form-label label">
          No. of months <br/>
          <small className="text-secondary">A month is for 30 days</small>
        </label>
        <input type="number" className="form-control col-3 value" id="months" value={months} placeholder="1" onChange={e => handleMonths(e.target.value)} min={1} required />
      </div>
      <hr/>
      <div className="form-group row total-price">
        <div className="col-8 label">Total price for {months} month{months > 1 && "s"}</div>
        <div className="col-4 value">INR {totalPrice}/-</div>
      </div>
      <div className="py-3">
        <button className="btn btn-next pull-right" onClick={goNext}>
          Next
        </button>
      </div>
		</div>
	);
}

export default CalculatePriceComponent;
