export default ({
  id: number(),
  user: user, // foreign key - OneToOne relationship
  post: post, // foreign key - OneToOne relationship
  createdAt: new Date(),
  updatedAt: new Date()
})
