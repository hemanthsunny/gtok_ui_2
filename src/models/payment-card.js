export default ({
  id: number(),
  user: user, //foreign key
  name: str(),
  number: number(),
  expiryDate: str(),
  securityCode: str(), // 3 digits of card
  createdAt: new Date,
  updatedAt: new Date
});
