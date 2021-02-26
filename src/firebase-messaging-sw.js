import * as firebase from "firebase/app";
import "firebase/messaging";

firebase.initializeApp({
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,	
});

const messaging = firebase.messaging();

export messaging;
