// Ref1#https://www.codedodle.com/2014/12/social-network-friends-database.html
import { add, update, getQuery, firestore, timestamp } from "firebase_config";

export const createRelationships = async (currentUser, displayUser={}, status=null) => {
	// const StatusCodes = {
	// 	0: "Pending",
	// 	1: "Accepted/Followed",
	// 	2: "Declined",
	// 	3: "Blocked"
	// }
	let res = "";
	let logsData = {
		text: `${currentUser.displayName} followed you`,
		photoURL: currentUser.photoURL,
		receiverId: "",
		userId: currentUser.id,
		actionType: "create",
		collection: "userRelationships",
		actionId: "",
		actionKey: "followers",
		actionLink: "/app/search",
		timestamp
	}
	let data = {
		userIdOne: currentUser.id,
		userIdTwo: displayUser.id,
		status: displayUser["permissions"]["private"] ? 0 : 1,
		actionUserId: currentUser.id
	}
	let rln = await getQuery(
		firestore.collection("userRelationships").where("userIdOne", "==", currentUser.id).where("userIdTwo", "==", displayUser.id).get()
	);

	/* Start: If a user is private or blocked, the status must be pending */
	let rlnTwo = await getQuery(
		firestore.collection("userRelationships").where("userIdOne", "==", displayUser.id).where("userIdTwo", "==", currentUser.id).get()
	);
	if (rlnTwo[0] && rlnTwo[0]["status"] === 3) { data["status"] = 0 }
	/* End */

	if (!rln[0]) {
		if (status === "follow") {
			if (data["status"] === 0) {
				logsData["receiverId"] = data["userIdTwo"];
				logsData["text"] = `${currentUser.displayName} sent you a follow request.`;
			} else if (data["status"] === 1) {
				logsData["receiverId"] = data["userIdTwo"];
				logsData["text"] = `${currentUser.displayName} followed you`;				
			}
			res = await add("userRelationships", data);
		}
	} else {
	 	if (status === "follow") {
			res = await update("userRelationships", rln[0].id, { status: data["status"],	actionUserId: data["actionUserId"]});
		} else if (
			status === "unfollow" || status === "unblock" || status === "cancel_request"
		) {
			if (status === "unfollow") {
				logsData["text"] = `${currentUser.displayName} blocked you`;
				logsData["actionType"] = "update";
				logsData["actionId"] = rln[0].id;
				logsData["actionKey"] = "block";
			} else if (status === "unblock") {
				logsData["text"] = `${currentUser.displayName} unblocked you`;
				logsData["actionType"] = "update";
				logsData["actionId"] = rln[0].id;
				logsData["actionKey"] = "unblock";
			} else if (status === "cancel_request") {
				logsData["text"] = `${currentUser.displayName} declined your follow request`;
				logsData["actionType"] = "update";
				logsData["actionId"] = rln[0].id;
				logsData["actionKey"] = "decline";
			}
			res = await update("userRelationships", rln[0].id, { status: null,	actionUserId: currentUser.id});
		} else if (status === "block") {
			logsData["text"] = `${currentUser.displayName} blocked you`;
			logsData["actionType"] = "update";
			logsData["actionId"] = rln[0].id;
			logsData["actionKey"] = "block";
			res = await update("userRelationships", rln[0].id, {status: 3, actionUserId:currentUser.id});
			res = await update("userRelationships", rlnTwo[0].id, {status: null, actionUserId:currentUser.id});
		} else if (status === "accept_request") {
			logsData["receiverId"] = data["userIdTwo"];
			logsData["text"] = `${currentUser.displayName} accepted your follow request`;
			logsData["actionType"] = "update";
			logsData["actionId"] = rln[0].id;
			logsData["actionKey"] = status;
			res = await update("userRelationships", rln[0].id, {status: 1, actionUserId:currentUser.id});
			res = await update("userRelationships", rlnTwo[0].id, {status: 1, actionUserId:currentUser.id});
		} else if (status === "decline_request") {
			logsData["text"] = `${currentUser.displayName} declined your follow request`;
			logsData["actionType"] = "update";
			logsData["actionId"] = rlnTwo[0].id;
			logsData["actionKey"] = status;
			res = await update("userRelationships", rlnTwo[0].id, {status: null, actionUserId:currentUser.id});
		}
	}
	if (!!res) {
  	await add("logs", logsData);
	}
	return res;
}