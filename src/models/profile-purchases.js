export default ({
  id: number(),
  user: user, //foreign key
  profileUser: userTwo, // foreign key
  active: true,
  createdAt: new Date,
  updatedAt: new Date
});
