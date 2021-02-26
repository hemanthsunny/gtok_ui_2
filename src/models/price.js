export default ({
  id: number(),
  user: user, //foreign key
  price: str(),
  premium: str(), // posts, chat
  createdAt: new Date,
  updatedAt: new Date
});
