import React, { useState } from "react";
import { connect } from "react-redux";
import { SetSubscriptionPlans } from "store/actions";
import { get } from "firebase_config";

const PaymentsComponent = ({ plans, bindSubscriptionPlans }) => {
  const [selectedPlan, setSelectedPlan] = useState("");

  const getPlans = async () => {
    const content = await get("subscriptions");
    bindSubscriptionPlans(content.sort((a, b) => a.id - b.id));
  };
  if (!plans[0]) getPlans();

  const checkout = () => {
    // Redirect to checkout page
    if (!selectedPlan) {
      alert("No plan selected");
    }
  };

  return (
    <div className="container">
      <div className="pull-right">
        <button className="btn btn-outline-danger" onClick={checkout}>
          Checkout
        </button>
      </div>
      <br />
      <div className="row">
        {plans &&
          plans.map((plan, i) => (
            <div className="col-sm-4 mt-5" key={i}>
              <div
                className="card subscription-plan-card"
                style={{ width: "18rem" }}
              >
                <div className="card-header bg-danger text-white text-center text-uppercase p-1">
                  {plan.header}
                </div>
                <div className="body">
                  <div className="text-center pt-3 pb-2">
                    {!plan.requiredBadges ? (
                      <h6>
                        {plan.months} month{plan.months > 1 && "s"}
                      </h6>
                    ) : (
                      <h6> {plan.months} </h6>
                    )}
                  </div>
                  <h5 className="text-center">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="subscription_plan"
                      id={i}
                      onChange={(e) => setSelectedPlan(plan)}
                    />
                    {!plan.requiredBadges ? (
                      <label htmlFor={i}>
                        {plan.currency === "gbp" ? (
                          <span>&#163;</span>
                        ) : plan.currency === "inr" ? (
                          <span>&#8377;</span>
                        ) : plan.currency === "usd" ? (
                          <span>&#36;</span>
                        ) : (
                          ""
                        )}
                        {plan.amountPerWeek}
                        <small className="small" style={{ fontSize: "14px" }}>
                          /week
                        </small>
                      </label>
                    ) : (
                      <label htmlFor={i}>{plan.amountPerWeek}</label>
                    )}
                  </h5>
                  {/* plan.badge && <div className='text-center letter-spacing-2'>
                    <span className='badge badge-warning text-light'>{plan.badge}</span> <i className='fa fa-tag text-warning'></i>
                  </div> */}
                  <ul className="payment-card-list">
                    {plan.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { plans } = state.subscriptionPlans;
  return { plans };
};

const mapDispatchToProps = (dispatch) => {
  return {
    bindSubscriptionPlans: (content) => dispatch(SetSubscriptionPlans(content)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsComponent);
