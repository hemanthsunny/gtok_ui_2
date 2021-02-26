import { getId, getQuery, firestore } from "firebase_config";

export const getPrices = async (currentUser) => {
	let prices = await getQuery(
		firestore.collection("prices").where("userId", "==", currentUser.id).orderBy("createdAt", "desc").get()
	);
	return prices;
}
