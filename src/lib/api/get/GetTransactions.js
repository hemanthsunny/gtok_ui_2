import { getQuery, firestore } from "firebase_config";

export const getTransactions = async (currentUser) => {
  const purchases = await getQuery(
    firestore
      .collection("transactions")
      .where("userId", "==", currentUser.id)
      .get()
  );
  return purchases;
};
