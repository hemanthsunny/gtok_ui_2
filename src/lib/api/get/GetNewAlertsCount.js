import { getQuery, firestore } from "firebase_config";

export const getNewAlertsCount = async (currentUser) => {
	let pageVisits = await getQuery(
		firestore.collection("pageVisits").orderBy("timestamp", "desc").where("userId", "==", currentUser.id).where("sourcePageUrl", "==", "/app/alerts").limit(1).get()
	);
	let alerts = [];
	if (pageVisits[0]) {
		alerts = await getQuery(
			firestore.collection('logs').orderBy("timestamp", "desc").where("receiverId", "==", currentUser.id).where("timestamp", ">", pageVisits[0].timestamp).get()
		);
	} else {
		alerts = await getQuery(
			firestore.collection('logs').orderBy("createdAt", "desc").where("receiverId", "==", currentUser.id).where("createdAt", ">", currentUser.updatedAt).get()
		);
	}
	return alerts.length;
}
