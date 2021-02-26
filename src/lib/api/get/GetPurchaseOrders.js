import { getQuery, firestore } from "firebase_config";

export const getPurchaseOrders = async (currentUser) => {
	let purchases = await getQuery(
		firestore.collection("purchaseOrders").where("userId", "==", currentUser.id).get()
	);
	return purchases;
}
