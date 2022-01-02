// Ref1#https://www.codedodle.com/2014/12/social-network-friends-database.html
import { add } from "firebase_config";

export const createUserRelations = async (currentUser) => {
  // const StatusCodes = {
  //   0: 'Pending',
  //   1: 'Accepted/Followed',
  //   2: 'Declined',
  //   3: 'Blocked'
  // }

  currentUser.followers.map((id) => {
    const data = {
      userIdOne: currentUser.id,
      userIdTwo: id,
      status: 1,
      actionUserId: currentUser.id,
    };
    if (currentUser.permissions.private) {
      data.status = 0;
    }
    const res = await add("usersRelations", data);
    return res;
  });
};
