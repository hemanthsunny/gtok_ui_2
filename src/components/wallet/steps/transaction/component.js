import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";

import { getId } from "firebase_config";
import { CustomImageComponent } from "components";

function TransactionComponent({ wallet, transaction, allUsers }) {
  const [transactionUser, setTransactionUser] = useState("");
  const history = useHistory();

  useEffect(() => {
    async function getTransactionUser() {
      let result = allUsers.find((user) => user.id === transaction.userId);
      if (!result) {
        result = await getId("users", transaction.userId);
      }
      result.id = transaction.userId;
      setTransactionUser(result);
    }
    if (!transactionUser) {
      getTransactionUser();
    }
  }, []);

  const redirectTo = () => {
    history.push({
      pathname: `/app/transactions/${transaction.id}`,
      state: { transaction },
    });
  };

  const currencyIcon = (transaction) => {
    let currency = "inr";
    if (transaction.currency === "inr" && transaction.type === "credit") {
      currency = "inr_green";
    } else if (transaction.currency === "inr" && transaction.type === "debit") {
      currency = "inr_red";
    }
    return (
      <img
        src={require(`assets/svgs/currency/inr/${currency}.svg`).default}
        className="currency-icon"
        alt="Posts"
      />
    );
  };

  return (
    transactionUser && (
      <div className="media p-2 pointer" onClick={redirectTo}>
        <CustomImageComponent user={transactionUser} />
        <div className="media-body pl-2">
          <div className="flex-row">
            <div className="pull-left transaction-name">
              {transactionUser.username}{" "}
              {transaction.status === "pending" && (
                <small className="text-warning">&middot; Pending</small>
              )}
            </div>
            <div
              className={`pull-right transaction-amount ${transaction.type}`}
            >
              <span>{transaction.type === "debit" ? "-" : "+"}</span>
              {currencyIcon(transaction)}
              {transaction.amount}
            </div>
          </div>
          <br />
          <div className="text-secondary">
            <div className="transaction-date">
              {moment(transaction.createdAt).format("MMM D  'YY, h:mma")}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

const mapStateToProps = (state) => {
  const { allUsers } = state.users;
  return { allUsers };
};

export default connect(mapStateToProps, null)(TransactionComponent);
