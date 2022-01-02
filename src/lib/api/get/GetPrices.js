import { getQuery, firestore } from "firebase_config";

export const getPrices = async (currentUser) => {
  const prices = await getQuery(
    firestore
      .collection("prices")
      .where("userId", "==", currentUser.id)
      .orderBy("createdAt", "desc")
      .get()
  );
  return prices;
};
