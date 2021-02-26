import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

/* Permissions reference: https://stackoverflow.com/questions/58128847/what-all-mobile-permission-we-can-ask-in-a-pwa */

const UserPermissionsComponent = ({
	newMessagesCount,
	newAlertsCount
}) => {
	const [ hideNotify, setHideNotify ] = useState(true);
			// name: "notifications",
			// name: "geolocation",
			// name: "microphone",
			// name: "push",
			// name: "camera",
			// name: "persistent-storage"

	useEffect(() => {
		(async () => {
			navigator.permissions.query({name: "push", userVisibleOnly: true});
			navigator.permissions.query({name: "midi", sysex: true});
			navigator.permissions.query({name: "microphone"});
			navigator.permissions.query({name: "geolocation"});
			navigator.permissions.query({name: "camera"});
			// navigator.mediaDevices.getUserMedia({audio: true});
			setHideNotify(true);
		})();
		Notification.requestPermission(function(result) {
	    if (result === 'granted') {
	      navigator.serviceWorker.ready.then(function(registration) {
	      	if (newAlertsCount > 0) {
		        registration.showNotification('Lets Gtok', {
		          body: 'You received new alerts',
		          icon: 'https://beta.letsgtok.com/static/media/favicon.42ec26b0.png',
		          vibrate: [200, 100, 200, 100, 200, 100, 200],
		          tag: 'lets-gtok',
		          data: {
		          	url: 'https://beta.letsgtok.com/app/alerts'
		          },
		          click_action: 'https://beta.letsgtok.com/app/alerts',
		          fcm_options: {
		          	link: 'https://beta.letsgtok.com/app/alerts'
		          }
		        });
	      	}
	      	if (newMessagesCount > 0) {
		        registration.showNotification('Lets Gtok', {
		          body: 'You received a new messages',
		          icon: 'https://beta.letsgtok.com/static/media/favicon.42ec26b0.png',
		          vibrate: [200, 100, 200, 100, 200, 100, 200],
		          tag: 'lets-gtok',
		          data: {
		          	url: 'https://beta.letsgtok.com/app/chats'
		          },
		          fcm_options: {
		          	link: 'https://beta.letsgtok.com/app/chats'
		          },
		          click_action: 'https://beta.letsgtok.com/app/chats'
		        });
	      	}
	      });
	    }
	  });
	}, [newAlertsCount, newMessagesCount]);

	return (
		<div className={`text-center ${hideNotify && "d-none"}`}>
			Please accept permissions.
		</div>
	)
}

const mapStateToProps = (state) => {
	const { newMessagesCount } = state.chatMessages;
	const { newAlertsCount } = state.alerts;
	return { newMessagesCount, newAlertsCount };
}

export default connect(
	mapStateToProps, 
	null
)(UserPermissionsComponent);