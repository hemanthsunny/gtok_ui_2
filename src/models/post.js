export default ({
  id: number(),
  user: user, // foreign key
  type: str(), // activity, feeling
  stories: arr(),
  totalVotes: number(),
  createdAt: new Date(),
  updatedAt: new Date()
})
