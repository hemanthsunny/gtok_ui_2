export default ({
  id: number(),
  from: user, // foreign key - purchasing user
  to: user, // receiving user
  currency: str(), // currency type - inr, dollar, pound
  amount: str(),
  status: str(), // success, pending, fail, initiated,
  paymentCard: paymentCard, // include card details to track transaction
  createdAt: new Date(),
  updatedAt: new Date()
})
