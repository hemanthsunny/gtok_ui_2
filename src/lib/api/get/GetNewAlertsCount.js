import { getQuery, firestore } from "firebase_config";

export const getNewAlertsCount = async (currentUser) => {
  let alerts = [];
  alerts = await getQuery(
    firestore
      .collection("logs")
      .where("receiverId", "==", currentUser.id)
      .where("unread", "==", true)
      .get()
  );
  return alerts.length;
};
