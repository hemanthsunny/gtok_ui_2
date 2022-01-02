import { getId, getQuery, firestore } from "firebase_config";

export const getTrendingPosts = async (currentUser) => {
  let trendingPosts = await getQuery(
    firestore
      .collection("posts")
      .where("followersCount", ">", 0)
      .orderBy("followersCount", "desc")
      .limit(3)
      .get()
  );
  trendingPosts = trendingPosts.map(async (post) => {
    post.user = await getId("users", post.userId);
    return post;
  });
  return trendingPosts;
};
