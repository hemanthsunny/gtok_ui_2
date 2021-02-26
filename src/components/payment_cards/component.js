import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderComponent from "./header";

import { getQuery, firestore, remove } from "firebase_config";

function PaymentCardsComponent({currentUser}) {
  const [ cards, setCards ] = useState([]);
	const [ result, setResult ] = useState({});

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
		let cards = await getQuery(
			firestore.collection("paymentCards").orderBy("createdAt", "desc").get()
		);
		cards = cards.sort((a,b) => b.createdAt - a.createdAt);
    setCards(cards);
	}

  const removeCard = async (card) => {
    if (window.confirm(`Are you sure to remove this ${card.number.substring(0, 3)}XXXXXXXXXX?`)) {
      let res = await remove('paymentCards', card.id);
      // No need to update result state
      setResult(res);
      if (res.status === 200) {
        loadCards();
      } else {
        alert('Unable to remove card at the moment. Try later');
      }
    }
  }

	return (
    <div>
      <HeaderComponent />
  	  <div className="container payment-cards-wrapper">
        {cards[0] ?
          cards.map((card, idx) => (
            <div className="card p-2 mb-2" key={idx}>
              <div className="pull-left">
                <div className="card-number">{card.number.substring(0, 3)}XXXXXXXXXX</div>
                <div className="card-name">{card.name}</div>
              </div>
              <div className="">
                <img src={require(`assets/svgs/Trash.svg`)} className="trash-icon pointer" alt="Remove" onClick={e => removeCard(card)} />
              </div>
            </div>
          )) :
          <div className="text-center font-sm">No cards added yet.</div>
        }
        <Link to="/app/settings/add_payment_card" className="col-12 btn btn-outline-secondary btn-sm my-2">Add new card</Link>
    		<div className="text-center">
  	    	{
  	    		result.status &&
  	    		<div className={`text-${result.status === 200 ? "success" : "danger"} mb-2`}>
  			    	{result.message}
  	    		</div>
  	    	}
  			</div>
  		</div>
    </div>
	);
}

export default PaymentCardsComponent;
