export default ({
  id: number(),
  status: str(), // follow, pending, following, blocked
  from: user, // foreign key - always a current user
  to: user, // foreign key
  createdAt: new Date(),
  updatedAt: new Date()
})
