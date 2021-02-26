import { getId, getQuery, firestore } from "firebase_config";

export const getWallet = async (currentUser) => {
	let wallet = await getQuery(
		firestore.collection("wallets").where("userId", "==", currentUser.id).get()
	);
	return wallet;
}
