import React, { useEffect } from "react";
import { withRouter } from 'react-router-dom';

import { add, getId, getQuery, firestore } from "firebase_config";
import { LoadingComponent } from "components";

const CreateChatComponent = (props) => {
	const chatUserId = props.match.params.id;
	const { currentUser } = props;

	useEffect(() => {
		let usersInStrFormat = [currentUser.id, chatUserId].sort().toString();
		async function checkForConvo() {
			let convo = await getQuery(
				firestore.collection("conversations").where("usersInStrFormat", "==", usersInStrFormat).get()
			);
			return convo;
		}
		async function getInitialConversation() {
			let convo = await checkForConvo();

			if (!convo[0]) {
				let resultUser = await getUser(chatUserId);
				let data = {
					admin: currentUser.id,
					usersInStrFormat: usersInStrFormat,
					users: [currentUser.id, chatUserId],
					groupName: null,
					photoURL: null,
					group: false,
					usersRef: [
						{
							ref: "users/"+currentUser.id,
							id: currentUser.id,
							displayName: currentUser.displayName,
							photoURL: currentUser.photoURL,
							lastSeen: new Date().getTime()
						},
						{
							ref: "users/"+chatUserId,
							id: chatUserId,
							displayName: resultUser.displayName,
							photoURL: resultUser.photoURL,
							lastSeen: new Date().getTime()
						}
					],
				}

				await add("conversations", data);
				convo = await checkForConvo();
			}
			props.history.push("/app/chats/"+convo[0].id);
		}
		getInitialConversation();
	}, [chatUserId, currentUser, props.history]);


  const getUser = async (id) => {
  	let result = await getId("users", id);
  	return result || {};
  }

  return (
    <div className="container-fluid text-center">
    	<LoadingComponent />
    </div>
  );
};

export default withRouter(CreateChatComponent);